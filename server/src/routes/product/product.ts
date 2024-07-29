import express from 'express';
import {createProduct,addPriceToVariant ,getProducts,updateProduct,getProduct ,addSizeAndKeysToVideo} from '../../controller/product/product'


import { checkProductAccess, isAuthenticatedAdmin } from '@src/middleware/auth';

const productRouter = express.Router(); 
productRouter.route("/").post(isAuthenticatedAdmin,createProduct).get(getProducts);
productRouter.route("/video").patch(addSizeAndKeysToVideo)
productRouter.route("/:id").patch(updateProduct).get(getProduct);
productRouter.route("/variant/:id").patch(addPriceToVariant);

export default productRouter;   
