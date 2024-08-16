import express from 'express';
import { createOrder, fetchOrdersByCustomerId, getOrders, getOrder } from '@src/controller/orders/order';
import { isAuthenticatedCustomer } from '@src/middleware/auth';

const orderRouter = express.Router();


orderRouter.route('/').post(isAuthenticatedCustomer,createOrder);
orderRouter.route('/').get(isAuthenticatedCustomer,getOrders)
orderRouter.route('/:id').get(isAuthenticatedCustomer,getOrder);
orderRouter.route('/customer/:id').get(isAuthenticatedCustomer,fetchOrdersByCustomerId);

export default orderRouter;