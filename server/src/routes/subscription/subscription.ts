import { createSubscription, deleteSubscription, getSubscription, getSubscriptionById, updateSubscription } from '@src/controller/subscription/subscription';
import express from 'express';

const subscriptionRouter = express.Router();


subscriptionRouter.route('/create').post(createSubscription);
subscriptionRouter.route('/').get(getSubscription);
subscriptionRouter.route('/:id').get(getSubscriptionById);
subscriptionRouter.route('/update/:id').patch(updateSubscription);
subscriptionRouter.route('/delete/:id').delete(deleteSubscription);
export default subscriptionRouter;