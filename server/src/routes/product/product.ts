import express from "express";
import {
  createProduct,
  addPriceToVariant,
  getProducts,
  updateProduct,
  getProduct,
  addSizeAndKeysToVideo,
  getProductsByIds,
  getProductData,
  buyWithCredits,
  getPurchasedProducts,
  getProductForCustomer,
} from "../../controller/product/product";
import {
  isAuthorizedCustomer,
  isAuthenticatedAdmin,
  isAuthenticatedCustomer,
} from "@src/middleware/auth";
import {
  addProductToCart,
  removeProductFromCart,
} from "@src/controller/user/customer";

const productRouter = express.Router();

// Admin
productRouter
  .route("/")
  .post(isAuthenticatedAdmin, createProduct)
  .get(isAuthenticatedAdmin, getProducts);
productRouter.route("/get").get(isAuthenticatedCustomer, getProductData);
productRouter
  .route("/video")
  .patch(isAuthenticatedAdmin, addSizeAndKeysToVideo);

productRouter
  .route("/variant/:id")
  .patch(isAuthenticatedAdmin, addPriceToVariant);

//Customer
productRouter
  .route("/cart/data")
  .get(isAuthenticatedCustomer, getProductsByIds);
productRouter
  .route("/addToCart")
  .post(isAuthenticatedCustomer, addProductToCart);
productRouter
  .route("/removeFromCart")
  .post(isAuthenticatedCustomer, removeProductFromCart);
productRouter
  .route("/buyWithCredits/:productId")
  .post(isAuthenticatedCustomer, buyWithCredits);
productRouter
  .route("/purchased")
  .get(isAuthenticatedCustomer, getPurchasedProducts);
productRouter
  .route("/customer")
  .get(isAuthorizedCustomer, getProductForCustomer);
productRouter
  .route("/:id")
  .patch(isAuthenticatedAdmin, updateProduct)
  .get(getProduct);

// customer-data routes

export default productRouter;
