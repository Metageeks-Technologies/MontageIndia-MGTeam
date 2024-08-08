import express from "express";
import { createOrder, paymentCapture } from "@src/controller/payment/orders/order";
import { createPlan, createSubscription, fetchAllPlans, fetchPlanById, updatePlan, verifyPayment } from "@src/controller/payment/subscription/subscription";
import { paymentWebHook } from "@src/controller/payment/webhook";

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
paymentRouter.route('/plan/:id').patch(updatePlan);
paymentRouter.route('/verifySubscription').post(verifyPayment);


export default paymentRouter;