import { createOrder, paymentCapture, paymentRefund } from "@src/controller/payment/payment";
import express from "express";

const paymentRouter = express.Router();


paymentRouter.route('/order').post(createOrder);
paymentRouter.route('/paymentCapture').post(paymentCapture);
paymentRouter.route('/paymentRefund').post(paymentRefund);

export default paymentRouter;