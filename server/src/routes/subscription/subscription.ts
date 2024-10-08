import express from 'express';
import { createPlan, fetchAllPlans, fetchPlanById, updatePlan, verifyPayment, createSubscription, getSubscriptionHistory } from '@src/controller/subscription/subscription';
import { firebaseAuth, isAuthenticatedAdmin, isAuthenticatedCustomer } from '@src/middleware/auth';

const subscriptionRouter = express.Router();

subscriptionRouter.route('/createPlan').post(createPlan);
subscriptionRouter.route('/fetchAllPlans').get(fetchAllPlans);
subscriptionRouter.route('/plan/:id').get(fetchPlanById);
subscriptionRouter.route('/create').post(firebaseAuth,createSubscription);
subscriptionRouter.route('/plan/:id').patch(isAuthenticatedAdmin,updatePlan);
subscriptionRouter.route('/verify').post(verifyPayment);
subscriptionRouter.route('/history').get(isAuthenticatedAdmin, getSubscriptionHistory);

export default subscriptionRouter