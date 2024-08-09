import { createOrder, fetchOrdersByCustomerId } from '@src/controller/product/order';
import express from 'express';

const router = express.Router();

// Route to create a new order
router.post('/orders', createOrder);
router.get('/orders/:id', fetchOrdersByCustomerId);




export default router;
