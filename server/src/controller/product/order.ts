import { Request, Response, NextFunction } from 'express';
import catchAsyncError from '@src/middleware/catchAsyncError';
import Order from '@src/model/product/order';


export const createOrder = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const {
        userId,
        items,
        totalAmount,
        status,
        paymentDetails
    } = req.body;

    if (!userId || !items || !totalAmount || !status || !paymentDetails) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    if (!paymentDetails.paymentMethod || !paymentDetails.paymentId || !paymentDetails.paymentDate) {
        return res.status(400).json({
            success: false,
            message: "All payment details are required"
        });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Items array must not be empty"
        });
    }

    for (const item of items) {
        if (!item.productId || !item.name || !item.amount || !item.mediaType) {
            return res.status(400).json({
                success: false,
                message: "Each item must include productId, name, amount, and mediaType"
            });
        }
    }

    // Create new order
    const newOrder = await Order.create({
        userId,
        items,
        totalAmount,
        status,
        paymentDetails
    });

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        order: newOrder
    });
});

export const fetchOrdersByCustomerId = catchAsyncError(async (req, res, next) => {
  const { id } = req.params; 
  
  const orders = await Order.find({ userId:id });

  if (!orders ) {
    return res.status(404).json({ message: 'No orders found for this user.' });
  }

  res.status(200).json({ orders });
});

export const getOrders = catchAsyncError(async (req: any, res, next) => {
    
    const orders = await Order.find();
 
    res.status(201).json({
     success: true,
     orders:orders,
    });
});
 
export const getOrder = catchAsyncError(async (req: any, res, next) => {
 
     const { id:orderId } = req.params;
 
     const order = await Order.findById(orderId);
     if(!order){
         return next(new ErrorHandler('Order not found',404));
     }
     
     res.status(201).json({
      success: true,
      order,
     });
});

