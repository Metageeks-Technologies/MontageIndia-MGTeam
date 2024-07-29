import express from 'express';
import {createProduct,addPriceToVariant ,getProducts,updateProduct,getProduct ,addSizeAndKeysToVideo} from '../../controller/product/product'

const productRouter = express.Router(); 
productRouter.route("/").post(createProduct).get(getProducts);
productRouter.route("/video").patch(addSizeAndKeysToVideo)
productRouter.route("/:id").patch(updateProduct).get(getProduct);
productRouter.route("/variant/:id").patch(addPriceToVariant);

export default productRouter;
