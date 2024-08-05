import express from 'express';
import { createSubscription, deleteSubscription, getSubscription, getSubscriptionById, updateSubscription } from '@src/controller/subscription/subscription';

const subscriptionRouter = express.Router();

subscriptionRouter.route("/").post(createSubscription);
subscriptionRouter.route('/').get(getSubscription);
subscriptionRouter.route('/:id').get(getSubscriptionById);
subscriptionRouter.route('/:id').patch(updateSubscription);
subscriptionRouter.route('/:id').delete(deleteSubscription);
export default subscriptionRouter;