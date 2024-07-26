import express from 'express';
import {createProduct,addPriceToVariant  } from '../../controller/product/product'

const productRouter = express.Router(); 
productRouter.route("/").post(createProduct);
productRouter.route("/variant/:id").patch(addPriceToVariant);

export default productRouter;
