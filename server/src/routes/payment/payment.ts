import { createOrder, paymentCapture } from "@src/controller/payment/orders/order";
import { createPlan, createSubscription, fetchAllPlans, fetchPlanById } from "@src/controller/payment/subscription/subscription";
import { paymentWebHook } from "@src/controller/payment/webhook";
import express from "express";

const paymentRouter = express.Router();

// order routes
paymentRouter.route('/createOrder').post(createOrder);
paymentRouter.route('/paymentCapture').post(paymentCapture);
// paymentRouter.route('/verifyOrder').post(verifyOrder);
paymentRouter.route('/webhook').post(paymentWebHook);
// paymentRouter.route('/paymentRefund').post(paymentRefund);


// subscription routes
paymentRouter.route('/createPlan').post(createPlan);
paymentRouter.route('/fetchAllPlans').get(fetchAllPlans);
paymentRouter.route('/plan/:id').get(fetchPlanById);
paymentRouter.route('/createSubscription').post(createSubscription);


export default paymentRouter;