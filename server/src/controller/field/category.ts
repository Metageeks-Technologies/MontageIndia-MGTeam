import catchAsyncError from "@src/middleware/catchAsyncError.js";
import ErrorHandler from "@src/utils/errorHandler.js";
import Category from "@src/model/fields/category";
import { getUrlForCategoryImage } from "@src/lib/uploadToS3";

interface CategoryRequestBody {
  category: string;
  description: string;
  image: string;
}

export const createCategory = catchAsyncError(async (req: any, res, next) => {
  const { category, description, image } = req.body as CategoryRequestBody;
  console.log(" from req :", category);
  const modifiedCategory = category.trim().toLowerCase();
  const existingCategory = await Category.findOne({ name: modifiedCategory });
  if (existingCategory) {
    return next(new ErrorHandler("Category already exists", 400));
  }
  const newCategory = await Category.create({
    name: modifiedCategory,
    description,
    image,
  });

  res.status(201).json({
    success: true,
    category: newCategory,
  });
});

export const categoryImage = catchAsyncError(async (req: any, res: any, next: any) => {
  console.log("categoryImage request body:", req.body);
  const { filename } = req.body;
  
  if (!filename) {
    return next(new ErrorHandler('Filename is required', 400));
  }

  try {
    const url = await getUrlForCategoryImage(filename);
    res.json({ success: true, url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    next(new ErrorHandler('Error generating upload URL', 500));
  }
});

export const getCategories = catchAsyncError(async (req, res, next) => {
  const categories = await Category.find();

  res.status(200).json({
    success: true,
    categories,
  });
});

export const getCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }
  res.status(200).json({
    success: true,
    category,
  });
});

export const updateCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  console.log("id:-", id);
  console.log("reqbody:-", req.body);
  const { category, description, image } = req.body as CategoryRequestBody;
  const modifiedCategory = category.trim().toLowerCase();
  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    { name: modifiedCategory, description, image },
    { new: true, runValidators: true }
  );
  if (!updatedCategory) {
    return next(new ErrorHandler("Category not found", 404));
  }
  res.status(200).json({
    success: true,
    category: updatedCategory,
  });
});

export const deleteCategory = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }
  await category.deleteOne();
  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
