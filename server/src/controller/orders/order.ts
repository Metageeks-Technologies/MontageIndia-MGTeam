import catchAsyncError from "@src/middleware/catchAsyncError";
import ErrorHandler from "@src/utils/errorHandler";
import Razorpay from "razorpay";
import config from "@src/utils/config";
import Order from "@src/model/product/order";

/*
index

order controllers
1.createOrder
2.paymentCapture

*/

const razorpayInstance=()=>{
    return new Razorpay({
        key_id: config.razorpayKey as string,
        key_secret: config.razorpaySecret as string,
    });
}

export const createOrder= catchAsyncError(async (req:any, res, next) => {

    const razorpay = razorpayInstance();
    console.log("step1:",req.body);

    const options = {
        amount: req.body.amount,
        currency: req.body.currency || "INR",
        receipt: req.body.receipt || "any unique id for every order",
        payment_capture: '1'
    };

    const response = await razorpay.orders.create(options);
    console.log("step2:",response);

    if(!response){
        return next(new ErrorHandler("Error occured while creating Order", 404));
    }
    const amountString = req.body.amount.toString(); 
    const trimmedAmount = parseInt(amountString.slice(0, -2)); 
    const totalAmount = trimmedAmount; 

    const newOrder = await Order.create({
        userId: req.user._id,
        razorpayOrderId: response.id,
        products: req.body.notes.products,
        totalAmount: totalAmount,
        currency: req.body.currency,
        status: "pending",
        method: "razorpay",
    });

    const order = await newOrder.save();

    res.send({
        success: true,
        order_id: response.id,
        mi_order_id: order._id,
        currency: response.currency,
        amount: response.amount,
    });
});

export const fetchOrdersByCustomerId = catchAsyncError(async (req:any, res, next) => {
  const { id } = req.params; 
  
  const orders = await Order.find({ userId:id })
    .populate('products.productId', 'title'); 

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
 
export const getOrderById = catchAsyncError(async (req: any, res, next) => {
 
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

