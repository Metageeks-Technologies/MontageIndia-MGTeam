import catchAsyncError from '@src/middleware/catchAsyncError.js';
import ErrorHandler from '@src/utils/errorHandler.js';
import Product from '@src/model/product/product';
import Activity from '@src/model/activity/activity';

export const createProduct = catchAsyncError(async (req: any, res, next) => {
    
    
    // console.log("create product",req);
    const {category} = req.body;
    const product= await Product.create(req.body);
    
    const activity={
        adminId: req.user._id,
        name: req.user.name,
        email: req.user.email,
        username: req.user.username,
        action: 'Created',
        category: category,
        productId: product._id,
        timestamp: Date.now()
    }

    await Activity.create(activity);

    res.status(201).json({
        success: true,
        product    
    });
    
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