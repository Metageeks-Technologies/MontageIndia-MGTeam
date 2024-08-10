import express from 'express';
import {createProduct,addPriceToVariant ,getProducts,updateProduct,getProduct ,addSizeAndKeysToVideo, getProductsByIds} from '../../controller/product/product';
import { checkProductAccess, isAuthenticatedAdmin, isAuthenticatedCustomer } from '@src/middleware/auth';
import { addProductToCart, removeProductFromCart } from '@src/controller/user/customer';

const productRouter = express.Router(); 


// Admin 
productRouter.route("/").post(isAuthenticatedAdmin,createProduct).get(isAuthenticatedAdmin,getProducts);
productRouter.route("/video").patch(isAuthenticatedAdmin,addSizeAndKeysToVideo)
productRouter.route("/:id").patch(isAuthenticatedAdmin,updateProduct).get(getProduct);
productRouter.route( "/variant/:id" ).patch( isAuthenticatedAdmin, addPriceToVariant );
productRouter.route("/cart").post(isAuthenticatedCustomer,getProductsByIds)
productRouter.route( '/addToCart').post(isAuthenticatedCustomer, addProductToCart );
productRouter.route( '/removeFromCart' ).post(isAuthenticatedCustomer, removeProductFromCart );
export default productRouter;   
