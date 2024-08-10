import catchAsyncError from "@src/middleware/catchAsyncError";
import ErrorHandler from "@src/utils/errorHandler";
import Razorpay from "razorpay";
import crypto from "crypto";
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
    console.log("step1:",req.body)
    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: req.body.receipt || "any unique id for every order",
        notes:req.body.notes,
    };
   

    const response = await razorpay.orders.create(options);
    console.log("step2:",response);

    if(!response){
        return next(new ErrorHandler("Error occured while creating Order", 404));
    }

    const newOrder = await Order.create({
        userId: req.user._id,
        razorpayOrderId: response.id,
        productIds: req.body.notes,
        totalAmount: req.body.amount,
        currency: req.body.currency,
        status: "pending",
    });

    const order = await newOrder.save();

    res.send({
        success: true,
        rp_order_id: response.id,
        mi_order_id: order._id,
        currency: response.currency,
        amount: response.amount,
    });
});

export const paymentCapture= catchAsyncError(async (req:any, res, next) => {
    
    const {mi_order_id,rp_order_id,razorpay_payment_id,razorpay_signature}=req.body;

    if(!mi_order_id || !rp_order_id || !razorpay_payment_id || !razorpay_signature) return res.send({status: 'false', message: 'Invalid request'});
    const HMAC = crypto.createHmac('sha256', config.razorpaySecret as string);

    HMAC.update(rp_order_id + "|" + razorpay_payment_id);
    const generated_signature = HMAC.digest('hex');
    

    if (generated_signature !== razorpay_signature) {
         res.send({status: 'false', message: 'Bad request'});
    }
    //We can send the response and store information in a database.
    // const order = await Order.findOneAndUpdate(
    //     { _id: mi_order_id },
    //     { status: 'paid' }
    // )    
    res.json({
        status: 'ok',
        message: 'Payment successful',
    })
   
});



