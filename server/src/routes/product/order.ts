import { createOrder, fetchOrdersByCustomerId,getOrders,getOrder } from '@src/controller/product/order';
import { isAuthenticatedCustomer } from '@src/middleware/auth';
import express from 'express';

const router = express.Router();

// Route to create a new order
router.route('/').get(getOrders).post(createOrder);
router.get('/:id', getOrder);
router.get('/customer/:id', fetchOrdersByCustomerId);

export default router;
