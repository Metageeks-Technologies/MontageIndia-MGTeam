import express from "express";
import { isAuthenticatedCustomer } from "@src/middleware/auth";
import {
  addToWishlist,
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
} from "@src/controller/user/customer";
const userRouter = express.Router();

userRouter.route("/signup").post(signupCustomer);
userRouter.route("/login").post(loginCustomer);
userRouter.route("/logout").get(logoutCustomer);
userRouter.route("/getAll").get(getAllCustomer);
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
  .route("/wishlist")
  .get(isAuthenticatedCustomer, getWishlist)
  .patch(isAuthenticatedCustomer, addToWishlist)
  .delete(isAuthenticatedCustomer, removeFromWishlist);
export default userRouter;
