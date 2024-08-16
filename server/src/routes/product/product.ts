import express from 'express';
import {createProduct,addPriceToVariant ,getProducts,updateProduct,getProduct ,addSizeAndKeysToVideo, getProductsByIds} from '../../controller/product/product';
import { checkProductAccess, isAuthenticatedAdmin, isAuthenticatedCustomer } from '@src/middleware/auth';

const productRouter = express.Router(); 
productRouter.route("/").post(isAuthenticatedAdmin,checkProductAccess,createProduct).get(getProducts);
productRouter.route("/video").patch(isAuthenticatedAdmin,addSizeAndKeysToVideo)
productRouter.route("/:id").patch(isAuthenticatedAdmin,updateProduct).get(getProduct);
productRouter.route( "/variant/:id" ).patch( isAuthenticatedAdmin, addPriceToVariant );
productRouter.route("/cart").post(getProductsByIds)

export default productRouter;   

