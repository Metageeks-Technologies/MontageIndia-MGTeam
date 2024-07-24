import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";
import { resizeToOriginal, resizeForThumbnail, resizeToMedium, resizeToSmall, resizeForProductPage } from "../../lib/resizeImage"
import { uploadImage } from "../../lib/uploadToS3";
import sharp from 'sharp'

export const reduceImage = catchAsyncError(async (req, res, next) => {

    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
        return next(new ErrorHandler("Files not found", 404));
    }
    console.log(files);
    // return;

    // Process each image in parallel
    const processingPromises = files.map(async (file) => {
        const filename = file.originalname;
        // const category = JSON.parse(req.body.category);
        // const description = JSON.parse(req.body.description);
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
            { folder: 'Images/Original', filename: `Original-${imgName}` },
            { folder: 'Images/Medium', filename: `Medium-${imgName}` },
            { folder: 'Images/Small', filename: `Small-${imgName}` },
            { folder: 'Images/ProductPage', filename: `ProductPage-${imgName}` },
            { folder: 'Images/Thumbnail', filename: `Thumbnail-${imgName}` },
        ];

        for (const image of images) {
            try {
                await uploadImage(image);
            } catch (error) {
                console.log(error);
                next(new ErrorHandler(`Error uploading image`, 400));
            }
        }

        // Create a product entry for each image
        // const product = await Product.create({ name: filename, category, description });

        const { width, height } = await sharp(original, { limitInputPixels: 8585550069 }).metadata();

        return { msg: `Image ${imgName} uploaded successfully`, imgName, width, height };
    });

    try {
        const results = await Promise.all(processingPromises);
        res.json({ results });
    } catch (error) {
        console.error("Error processing images:", error);
        next(new ErrorHandler("Internal server error", 500));
    }
});





