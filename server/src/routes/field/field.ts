import express from 'express';
import { checkProductAccess, isAuthenticatedAdmin } from '@src/middleware/auth';
import { createCategory, getCategories ,getCategory,updateCategory,deleteCategory} from '@src/controller/field/category';

const fieldRouter = express.Router(); 
fieldRouter.route("/category").post(createCategory).get(getCategories);
fieldRouter.route("/category/:id").get(getCategory).patch(updateCategory).delete(deleteCategory);


export default fieldRouter;   
