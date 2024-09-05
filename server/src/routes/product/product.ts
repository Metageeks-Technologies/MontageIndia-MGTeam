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
  getSingleProductForCustomer,
  getProductFromAws,
  buyAllCartWithCredits,
} from "../../controller/product/product";
import {
  isAuthorizedCustomer,
  isAuthenticatedAdmin,
  isAuthenticatedCustomer,
  firebaseAuth
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
productRouter.route("/get").get(firebaseAuth, getProductData);
productRouter
  .route("/video")
  .patch(isAuthenticatedAdmin, addSizeAndKeysToVideo);

productRouter
  .route("/variant/:id")
  .patch(isAuthenticatedAdmin, addPriceToVariant);

//Customer
productRouter
  .route("/cart/data")
  .get(firebaseAuth, getProductsByIds);
productRouter
  .route("/addToCart")
  .post(firebaseAuth, addProductToCart);
productRouter
  .route("/removeFromCart")
  .post(firebaseAuth, removeProductFromCart);
productRouter
  .route("/buyWithCredits")
  .post(firebaseAuth, buyWithCredits);
productRouter
  .route("/cart/buyWithCredits")
  .post(firebaseAuth, buyAllCartWithCredits);
productRouter
  .route("/purchased")
  .get(firebaseAuth, getPurchasedProducts);
productRouter
  .route("/customer")
  .get(isAuthorizedCustomer, getProductForCustomer);

productRouter.route("/download").get(isAuthorizedCustomer, getProductFromAws);

productRouter
  .route("/customer/:id")
  .get(isAuthorizedCustomer, getSingleProductForCustomer);

productRouter
  .route("/:id")
  .patch(isAuthenticatedAdmin, updateProduct)
  .get(getProduct);

// customer-data routes

export default productRouter;
