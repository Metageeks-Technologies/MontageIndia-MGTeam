import catchAsyncError from '@src/middleware/catchAsyncError.js';
import ErrorHandler from '@src/utils/errorHandler.js';
import Category from '@src/model/fields/category';

interface CategoryRequestBody {
    category: string;
  }

export const createCategory = catchAsyncError(async (req: any, res, next) => {
    
    const {category} = req.body as CategoryRequestBody;
    const modifiedCategory = category.trim().toLowerCase();
    const existingCategory = await Category.findOne({name: modifiedCategory});
    if(existingCategory){
        return next(new ErrorHandler('Category already exists', 400));
    }
    const newCategory = await Category.create({name: modifiedCategory});

    res.status(201).json({
        success: true,
        category: newCategory    
    });  
});

export const getCategories = catchAsyncError(async (req, res, next) => {
    
    const categories = await Category.find();
    console.log("hi");
    
    res.status(200).json({
        success: true,
        categories:"no of categories are ",    
    })
});

export const getCategory = catchAsyncError(async (req, res, next) => {
    
    const {id}=req.params;
    const category = await Category.findById(id);
    if(!category){
        return next(new ErrorHandler('Category not found', 404));
    }
    res.status(200).json({
        success: true,
        category    
    })
});

export const updateCategory = catchAsyncError(async (req, res, next) => {
    
    const {id}=req.params;
    const {category} = req.body as CategoryRequestBody;
    const modifiedCategory = category.trim().toLowerCase();
    const updatedCategory = await Category.findByIdAndUpdate(id, {name: modifiedCategory}, {new: true, runValidators: true});
    if(!updatedCategory){
        return next(new ErrorHandler('Category not found', 404));
    }
    res.status(200).json({
        success: true,
        category: updatedCategory    
    })
});

export const deleteCategory = catchAsyncError(async (req, res, next) => {
    
    const {id}=req.params;
    const category = await Category.findById(id);
    if(!category){
        return next(new ErrorHandler('Category not found', 404));
    }
    await category.deleteOne();
    res.status(200).json({
        success: true,
        message: 'Category deleted successfully'    
    })
});