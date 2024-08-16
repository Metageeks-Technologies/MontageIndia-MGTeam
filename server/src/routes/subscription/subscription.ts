import express from 'express';
import { createPlan, fetchAllPlans, fetchPlanById, updatePlan, verifyPayment, createSubscription, getSubscriptionHistory } from '@src/controller/subscription/subscription';
import { isAuthenticatedAdmin, isAuthenticatedCustomer } from '@src/middleware/auth';

const subscriptionRouter = express.Router();

subscriptionRouter.route('/createPlan').post(createPlan);
subscriptionRouter.route('/fetchAllPlans').get(fetchAllPlans);
subscriptionRouter.route('/plan/:id').get(fetchPlanById);
subscriptionRouter.route('/create').post(isAuthenticatedCustomer,createSubscription);
subscriptionRouter.route('/plan/:id').patch(updatePlan);
subscriptionRouter.route('/verify').post(verifyPayment);
subscriptionRouter.route('/history').get(getSubscriptionHistory);

export default subscriptionRouter