import express from "express";
import { paymentWebHook } from "@src/controller/payment/webhook";
import { isAuthenticatedCustomer } from "@src/middleware/auth";
import {
  getTransactions,
  paymentVerify,
} from "@src/controller/payment/payment";
import bodyParser from "body-parser";

const paymentRouter = express.Router();

//transaction
paymentRouter.get("/transactions", isAuthenticatedCustomer, getTransactions);
paymentRouter.post("/verify", isAuthenticatedCustomer, paymentVerify);
// webHook
paymentRouter
  .route("/webhook")
  .post(bodyParser.raw({ type: "application/json" }), paymentWebHook);

export default paymentRouter;
