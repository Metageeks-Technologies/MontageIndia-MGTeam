import express from 'express';
import { checkProductAccess, isAuthenticatedAdmin } from '@src/middleware/auth';
import { createCategory, getCategories ,getCategory,updateCategory,deleteCategory, categoryImage} from '@src/controller/field/category';

const fieldRouter = express.Router(); 
fieldRouter.route("/category").post(createCategory).get(getCategories);
fieldRouter.route("/category/:id").get(getCategory).patch(updateCategory).delete(deleteCategory);
fieldRouter.route( '/upload' ).post( categoryImage );



export default fieldRouter;   
