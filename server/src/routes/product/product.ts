import express from 'express';
import {createProduct,addKeysAndVariants    } from '../../controller/product/product'

const productRouter = express.Router(); 
productRouter.route("/").post(createProduct);
productRouter.route("/:id").patch(addKeysAndVariants);



export default productRouter;
