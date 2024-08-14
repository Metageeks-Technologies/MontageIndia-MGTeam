import express from "express";
import { paymentWebHook } from "@src/controller/payment/webhook";
import { isAuthenticatedAdmin, isAuthenticatedCustomer } from "@src/middleware/auth";
import { getTransactions } from "@src/controller/payment/transaction/transaction";

const paymentRouter = express.Router();

//transaction
paymentRouter.get('/transactions',isAuthenticatedAdmin, getTransactions);
// webHook
paymentRouter.route('/webhook').post(paymentWebHook);

export default paymentRouter;