import express from "express";
import { paymentWebHook } from "@src/controller/payment/webhook";
import { isAuthenticatedCustomer } from "@src/middleware/auth";
import { getTransactions } from "@src/controller/payment/transaction/transaction";

const paymentRouter = express.Router();

//transaction
paymentRouter.get('/transactions',isAuthenticatedCustomer, getTransactions);
// webHook
paymentRouter.route('/webhook').post(paymentWebHook);

export default paymentRouter;