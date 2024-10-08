import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import {
  resizeToOriginal,
  resizeForThumbnail,
  getImageMetadata,
  resizeToMedium,
  resizeToSmall,
  resizeForProductPage,
} from "../../lib/resizeImage";
import { uploadImage } from "../../lib/uploadToS3";
import Product from "@src/model/product/product";
import { deleteLocalFile } from "@src/utils/helper";

export const reduceImage = catchAsyncError(async (req, res, next) => {
  const file = req.file as Express.Multer.File;
  console.log(file);

  if (!file) {
    return next(new ErrorHandler("Files not found", 404));
  }

  const uuid = JSON.parse(req.body.uuid);
  const mediaType = JSON.parse(req.body.mediaType);
  if (mediaType !== "image") {
    return next(new ErrorHandler("Wrong mediaType", 400));
  }

  const filename = file.originalname;
  const fileNameArray = filename.split(".");
  const fileExtension = fileNameArray[fileNameArray.length - 1];
  const input = `img/${filename}`;
  const imgName = `${uuid}.${fileExtension}`;
  console.log(filename);
  const original = `output/original-${imgName}`;

  try {
    await resizeToOriginal(input, imgName);
    await resizeToMedium(original, imgName);
    await resizeToSmall(original, imgName);
    await resizeForProductPage(original, imgName);
    await resizeForThumbnail(original, imgName);
  } catch (error: any) {
    console.log(error);
    return next(
      new ErrorHandler(
        error.message || `Error processing image ${imgName}`,
        400
      )
    );
  }

  const metadataOriginal = await getImageMetadata(original);
  const metadataMedium = await getImageMetadata(`output/medium-${imgName}`);
  const metadataSmall = await getImageMetadata(`output/small-${imgName}`);

  if (!metadataOriginal || !metadataMedium || !metadataSmall) {
    return next(new ErrorHandler(`Error While getting metadata`, 400));
  }

  // Upload the processed images
  const s3images = [
    { folder: `${uuid}/images`, filename: `medium-${imgName}` },
    { folder: `${uuid}/images`, filename: `small-${imgName}` },
    { folder: `${uuid}/images`, filename: `productPage-${imgName}` },
    { folder: `${uuid}/images`, filename: `thumbnail-${imgName}` },
    { folder: `${uuid}/images`, filename: `original-${imgName}` },
  ];

  // upload images to s3
  for (let i = 0; i < s3images.length; i++) {
    try {
      await uploadImage(s3images[i]);
    } catch (error) {
      console.log(error);
      next(new ErrorHandler(`Error uploading image`, 400));
    }
  }
  const product = await Product.findOne({ uuid });
  if (!product) {
    return next(new ErrorHandler(`Product not found`, 404));
  }
  const variants = [
    {
      metadata: metadataOriginal,
      key: `${uuid}/images/original-${imgName}`,
    },
    {
      metadata: metadataMedium,
      key: `${uuid}/images/medium-${imgName}`,
    },
    {
      metadata: metadataSmall,
      key: `${uuid}/images/small-${imgName}`,
    },
  ];

  product.variants.push(...variants);
  product.publicKey = `${uuid}/images/productPage-${imgName}`;
  product.thumbnailKey = `${uuid}/images/thumbnail-${imgName}`;
  const updatedProduct = await product.save();

  for (let i = 0; i < s3images.length; i++) {
    deleteLocalFile(`output/${s3images[i].filename}`);
  }
  deleteLocalFile(input);

  res.json({
    success: true,
    product: updatedProduct,
  });
});
