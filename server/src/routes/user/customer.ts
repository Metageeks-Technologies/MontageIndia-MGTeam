import express from "express";
import { isAuthenticatedCustomer } from "@src/middleware/auth";
import {
  addToWishlist,
  getProductForCustomer,
  removeFromWishlist,
  getWishlist,
} from "@src/controller/product/product";
import {
  getAllCustomer,
  signupCustomer,
  loginCustomer,
  logoutCustomer,
  getCurrentCustomer,
  deleteCustomer,
  updateCustomerDetails,
  changePassword,
  forgetPassword,
  resetPassword,
  getCustomerById,
  addProductToCart,
  removeProductFromCart,
  getPurchasedProduct,
} from "@src/controller/user/customer";
const userRouter = express.Router();

userRouter.route("/signup").post(signupCustomer);
userRouter.route("/login").post(loginCustomer);
userRouter.route("/logout").get(logoutCustomer);
userRouter.route("/getAll").get(isAuthenticatedCustomer, getAllCustomer);
userRouter
  .route("/getCurrent")
  .get(isAuthenticatedCustomer, getCurrentCustomer);
userRouter.route("/delete/:id").delete(isAuthenticatedCustomer, deleteCustomer);
userRouter
  .route("/update")
  .patch(isAuthenticatedCustomer, updateCustomerDetails);
userRouter
  .route("/changePassword")
  .patch(isAuthenticatedCustomer, changePassword);
userRouter.route("/forgetPassword").post(forgetPassword);
userRouter.route("/resetPassword").post(resetPassword);
userRouter.route("/:id").get(isAuthenticatedCustomer, getCustomerById);

userRouter
  .route("/product")
  .get(isAuthenticatedCustomer, getProductForCustomer);
userRouter
  .route("/wishlist")
  .get(isAuthenticatedCustomer, getWishlist)
  .patch(isAuthenticatedCustomer, addToWishlist)
  .delete(isAuthenticatedCustomer, removeFromWishlist);

userRouter.route("/product/purchased/:id").get(getPurchasedProduct);

export default userRouter;
