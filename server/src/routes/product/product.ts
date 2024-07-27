import express from 'express';
import {createProduct,addKeysAndVariants    } from '../../controller/product/product'
import { checkProductAccess, isAuthenticatedAdmin } from '@src/middleware/auth';

const productRouter = express.Router(); 
productRouter.route("/").post(isAuthenticatedAdmin,checkProductAccess,createProduct);
productRouter.route("/:id").patch(addKeysAndVariants);


export default productRouter;
