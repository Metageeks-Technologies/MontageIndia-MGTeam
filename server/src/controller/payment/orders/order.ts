import catchAsyncError from "@src/middleware/catchAsyncError";
import Razorpay from "razorpay";
import crypto from "crypto";
import config from "@src/utils/config";

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

export const createOrder= catchAsyncError(async (req, res, next) => {

    const razorpay = razorpayInstance();

    const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: req.body.receipt || "any unique id for every order",
        notes:req.body.notes,
    };
   
    const response = await razorpay.orders.create(options);
    res.json({
        data: response,
    });
});

export const paymentCapture= catchAsyncError(async (req, res, next) => {
    const data = crypto.createHmac('sha256', config.razorpayWebhookSecret as string);

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



