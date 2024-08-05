import catchAsyncError from "@src/middleware/catchAsyncError";
import Razorpay from "razorpay";
import crypto from "crypto";
import { json } from "stream/consumers";

/*
index

1.createOrder
2.paymentCapture
3.paymentRefund

*/

export const createOrder=()=>catchAsyncError(async (req, res, next) => {

 // initializing razorpay
    const razorpay = new Razorpay({
        key_id: req.body.keyId,
        key_secret: req.body.keySecret,
    });

    // setting up options for razorpay order.
    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: "any unique id for every order",
        payment_capture: 1
    };
   
    const response = await razorpay.orders.create(options);
    res.json({
        order_id: response.id,
        currency: response.currency,
        amount: response.amount,
    });
});

export const paymentCapture=()=>catchAsyncError(async (req, res, next) => {
    const data = crypto.createHmac('sha256', process.env.WEBHOOK_PAYMENT_SECRET_KEY as string);

    data.update(JSON.stringify(req.body))
    const digest = data.digest('hex')

    if (digest === req.headers['x-razorpay-signature']) {
        console.log('request is legit')
        //We can send the response and store information in a database.
        res.json({
            status: 'ok'
        })
    } else {
        res.status(400).send('Invalid signature');
    }
});

export const paymentRefund=()=>catchAsyncError(async (req, res, next) => {
    // initializing razorpay
    const razorpay = new Razorpay({
        key_id: req.body.keyId,
        key_secret: req.body.keySecret,
    });

    //Verify the payment Id first, then access the Razorpay API.

    const options = {
        amount: req.body.amount,
        speed: "normal",
        "notes": {
            "notes_key_1": "Beam me up Scotty.",
            "notes_key_2": "Engage"
        },
        "receipt": "Receipt No. 31"
    };

    const razorpayResponse = await razorpay.payments.refund(req.body.paymentId,options);
    //We can send the response and store information in a database
     res.status(200).json({status:"success", message:"razorpayResponse",razorpayResponse});
});