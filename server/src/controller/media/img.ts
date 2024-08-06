import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import { resizeToOriginal, resizeForThumbnail, resizeToMedium, resizeToSmall, resizeForProductPage } from "../../lib/resizeImage"
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
    const mediaType=  JSON.parse(req.body.mediaType);
    if(mediaType!=="image"){
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
    } catch (error:any) {
        console.log(error);
        return next(new ErrorHandler( error.message|| `Error processing image ${imgName}`, 400));
    }

    // Upload the processed images
    const s3images = [
        { folder: `${uuid}/images`, filename: `original-${imgName}` },
        { folder: `${uuid}/images`, filename: `medium-${imgName}` },
        { folder: `${uuid}/images`, filename: `small-${imgName}` },
        { folder: `${uuid}/images`, filename: `productPage-${imgName}` },
        { folder: `${uuid}/images`, filename: `thumbnail-${imgName}` },
    ];

    // upload images to s3
    for (let i=0;i<s3images.length;i++) {
        try {
            await uploadImage(s3images[i]);
        } catch (error) {
            console.log(error);
            next(new ErrorHandler(`Error uploading image`, 400));
        }
    }
    // delete local files
    for (let i=0;i<s3images.length;i++) {
        deleteLocalFile(`output/${s3images[i].filename}`);
    }
    deleteLocalFile(input);

    const product = await Product.findOne({uuid});
    if(!product){
        return next(new ErrorHandler(`Product not found`, 404));
    }
    const variants=[
        {
            size:"Original",
            key:`${uuid}/images/original-${uuid}`
        },
        {
            size:"Medium",
            key:`${uuid}/images/medium-${uuid}`
        },
        {
            size:"Small",
            key:`${uuid}/images/small-${uuid}`
        }
    ]

    product.variants.push(...variants);
    product.publicKey=`${uuid}/images/productPage-${uuid}`
    product.thumbnailKey=`${uuid}/images/thumbnail-${uuid}`
    const updatedProduct=await product.save();

    res.json({
        success:true,
        product:updatedProduct
    })
});
