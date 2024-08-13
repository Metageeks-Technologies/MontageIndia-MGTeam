import express from 'express';
import { createOrder, fetchOrdersByCustomerId, getOrders, getOrder } from '@src/controller/orders/order';

const orderRouter = express.Router();


orderRouter.route('/').get(getOrders).post(createOrder);
orderRouter.get('/:id', getOrder);
orderRouter.get('/customer/:id', fetchOrdersByCustomerId);

export default orderRouter;