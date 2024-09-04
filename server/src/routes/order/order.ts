import express from 'express';
import { createOrder, fetchOrdersByCustomerId, getOrders, getOrderById } from '@src/controller/orders/order';
import { isAuthenticatedCustomer,firebaseAuth } from '@src/middleware/auth';

const orderRouter = express.Router();

orderRouter.route('/').post(firebaseAuth,createOrder);
orderRouter.route('/').get(firebaseAuth,getOrders)
orderRouter.route('/:id').get(firebaseAuth,getOrderById);
orderRouter.route('/customer/:id').get(firebaseAuth,fetchOrdersByCustomerId);

export default orderRouter;