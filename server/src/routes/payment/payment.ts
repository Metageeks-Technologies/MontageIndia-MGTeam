import express from "express";
import { createOrder, paymentCapture } from "@src/controller/payment/orders/order";
import { createPlan, createSubscription, fetchAllPlans, fetchPlanById, updatePlan, verifyPayment } from "@src/controller/payment/subscription/subscription";
import { paymentWebHook } from "@src/controller/payment/webhook";
import { isAuthenticatedCustomer } from "@src/middleware/auth";

const paymentRouter = express.Router();

// order routes
paymentRouter.route('/createOrder').post(createOrder);
paymentRouter.route('/paymentCapture').post(paymentCapture);

// subscription routes
paymentRouter.route('/createPlan').post(createPlan);
paymentRouter.route('/fetchAllPlans').get(fetchAllPlans);
paymentRouter.route('/plan/:id').get(fetchPlanById);
paymentRouter.route('/createSubscription').post(isAuthenticatedCustomer,createSubscription);
paymentRouter.route('/plan/:id').patch(updatePlan);
paymentRouter.route('/verifySubscription').post(verifyPayment);

// webHook
paymentRouter.route('/webhook').post(paymentWebHook);


export default paymentRouter;