import express from 'express';
import {createProduct,addPriceToVariant ,getProducts,updateProduct,getProduct ,addSizeAndKeysToVideo} from '../../controller/product/product';
import { checkProductAccess, isAuthenticatedAdmin } from '@src/middleware/auth';

const productRouter = express.Router(); 
productRouter.route("/").post(isAuthenticatedAdmin,checkProductAccess,createProduct).get(getProducts);
productRouter.route("/video").patch(isAuthenticatedAdmin,addSizeAndKeysToVideo)
productRouter.route("/:id").patch(isAuthenticatedAdmin,updateProduct).get(getProduct);
productRouter.route("/variant/:id").patch(isAuthenticatedAdmin,addPriceToVariant);

export default productRouter;   
