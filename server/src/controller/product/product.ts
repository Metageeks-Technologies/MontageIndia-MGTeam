import catchAsyncError from '@src/middleware/catchAsyncError.js';
import ErrorHandler from '@src/utils/errorHandler.js';
import Product from '@src/model/product/product';

export const createProduct = catchAsyncError(async (req, res, next) => {
    
    const product= await Product.create(req.body);
    
    res.status(201).json({
        success: true,
        product    
    })
})

export const addPriceToVariant = catchAsyncError(async (req, res, next) => {
    
    const {id:vid} = req.params;
    const {uuid,price,label} =  req.body;

    const product  =  await Product.findOne({uuid});

    if (!product) {
        return next(new ErrorHandler(`product not found`, 404));
    }
    const variantIndex = product.variants.findIndex(variant => variant._id?.toString() === vid);
    if (variantIndex === -1) {
        return next(new ErrorHandler(`variant not found with the given field`, 404));
    };
    const updateFields:any = {};
    if (label) updateFields[`variants.${variantIndex}.label`] = label;
    if (price) updateFields[`variants.${variantIndex}.price`] = price;

    const result = await Product.updateOne(
        { uuid, "variants._id": vid },
        { $set: updateFields },
        {
          arrayFilters: [{ "elem._id": vid }],
        }
      );
      const updatedProduct = await Product.findOne({uuid});
    
    res.status(201).json({
        success: true,
        product :updatedProduct   
    });
})

export const addKeysForVideoVariant = catchAsyncError(async (req, res, next) => {
    
//    
    
    
    res.status(201).json({
        success: true,
        product :""   
    });
})