import express from "express";
import { paymentWebHook } from "@src/controller/payment/webhook";
import { firebaseAuth, isAuthenticatedCustomer } from "@src/middleware/auth";
import {
  getTransactions,
  paymentVerify,
} from "@src/controller/payment/payment";
import { checkDuplicateEvent } from "@src/middleware/auth";

const paymentRouter = express.Router();

//transaction
paymentRouter.get("/transactions",firebaseAuth, getTransactions);
paymentRouter.post("/verify", firebaseAuth, paymentVerify);
// webHook
paymentRouter.route("/webhook").post(checkDuplicateEvent, paymentWebHook);

export default paymentRouter;
