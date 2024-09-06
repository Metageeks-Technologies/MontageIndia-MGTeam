import express from "express";
import { isAuthenticatedCustomer, firebaseAuth } from "@src/middleware/auth";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getCart,
  addToCart,
  removeFromCart,
  createCart,
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
  isPhoneExist,
  googleLogin,
  verifyEmail,
  isPhoneEmailExist,
  onDemandForm,
} from "@src/controller/user/customer";

const userRouter = express.Router();

userRouter.route("/verifyEmail").post(verifyEmail);
userRouter.route("/phone/").get(isPhoneExist);
userRouter.route("/phoneEmail").get(isPhoneEmailExist);
userRouter.route("/googleLogin").post(googleLogin);
userRouter.route("/signup").post(signupCustomer);
userRouter.route("/login").post(loginCustomer);
userRouter.route("/logout").get(logoutCustomer);
userRouter.route("/getAll").get(getAllCustomer);
userRouter.route("/getCurrent").get(firebaseAuth, getCurrentCustomer);
// userRouter.route("/delete/:id").delete(isAuthenticatedCustomer, deleteCustomer);
userRouter.route("/update").patch(firebaseAuth, updateCustomerDetails);
userRouter.route("/changePassword").patch(firebaseAuth, changePassword);
userRouter.route("/forgetPassword").post(forgetPassword);
userRouter.route("/resetPassword").post(resetPassword);

userRouter
  .route("/wishlist")
  .get(firebaseAuth, getWishlist)
  .patch(firebaseAuth, addToWishlist)
  .delete(firebaseAuth, removeFromWishlist);

userRouter
  .route("/cart")
  .post(firebaseAuth, createCart)
  .get(firebaseAuth, getCart)
  .patch(firebaseAuth, addToCart)
  .delete(firebaseAuth, removeFromCart);
userRouter.route("/onDemand/email").post(firebaseAuth, onDemandForm);

userRouter.route("/:id").get(firebaseAuth, getCustomerById);
export default userRouter;
