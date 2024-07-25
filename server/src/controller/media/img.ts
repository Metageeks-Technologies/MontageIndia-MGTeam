import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import { resizeToOriginal, resizeForThumbnail, resizeToMedium, resizeToSmall, resizeForProductPage } from "../../lib/resizeImage"
import { uploadImage } from "../../lib/uploadToS3";
import Product from "@src/model/product/product";

export const reduceImage = catchAsyncError(async (req, res, next) => {

    const file = req.file as Express.Multer.File;

    if (!file) {
        return next(new ErrorHandler("Files not found", 404));
    }

    const {uuid,mediaType} = JSON.parse(req.body);
    if(mediaType!=="image"){
        return next(new ErrorHandler("Wrong mediaType", 400));
    }

    const filename = file.originalname;     
    const input = `img/${filename}`;
    const imgName = filename;
    const original = `output/Original-${imgName}`;

    try { 
        await resizeToOriginal(input, imgName);
        await resizeToMedium(original, imgName);
        await resizeToSmall(original, imgName);
        await resizeForProductPage(original, imgName,next);
       
        await resizeForThumbnail(original, imgName);
    } catch (error:any) {
        console.log(error);
        return next(new ErrorHandler( error.message|| `Error processing image ${imgName}`, 400));
    }

    // Upload the processed images
    const images = [
        { folder: `${uuid}/Images`, filename: `Original-${uuid}` },
        { folder: `${uuid}/Images`, filename: `Medium-${uuid}` },
        { folder: `${uuid}/Images`, filename: `Small-${uuid}` },
        { folder: `${uuid}/Images`, filename: `ProductPage-${uuid}` },
        { folder: `${uuid}/Images`, filename: `Thumbnail-${uuid}` },
    ];

    for (const image of images) {
        try {
            await uploadImage(image);
        } catch (error) {
            console.log(error);
            next(new ErrorHandler(`Error uploading image`, 400));
        }
    }
    


    const product = await Product.findOne({uuid});
    if(!product){
        return next(new ErrorHandler(`Product not found`, 404));
    }
    const variants=[
        {
            size:"Original",
            key:`${uuid}/Images/Original-${uuid}`
        },
        {
            size:"Medium",
            key:`${uuid}/Images/Medium-${uuid}`
        },
        {
            size:"Small",
            key:`${uuid}/Images/Small-${uuid}`
        }
    ]

    product.variants.push(...variants);
    product.publicKey=`${uuid}/Images/ProductPage-${uuid}`
    product.thumbnailKey=`${uuid}/Images/Thumbnail-${uuid}`
    const updatedProduct=await product.save();

    res.json({
        success:true,
        product:updatedProduct
    })
});
