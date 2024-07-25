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
export const addKeysAndVariants = catchAsyncError(async (req, res, next) => {
    
    const {id:uuid} =req.params; 
    console.log(uuid);

    const product = await Product.findOneAndUpdate({uuid},req.body);
    
    res.status(201).json({
        success: true,
        product    
    })
} )