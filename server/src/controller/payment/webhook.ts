import catchAsyncError from "@src/middleware/catchAsyncError.js";
import customer from "@src/model/user/customer";
import order from '@src/model/product/order';
import config from "@src/utils/config";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import Transaction from "@src/model/transaction/transaction";

const subscriptionActivated= async(payload:any)=>{
  try {
    console.log("subscription activated",payload);
    const planId=payload.subscription.entity.id;

    await customer.findOneAndUpdate(
      { 'subscription.subscriptionId': planId },
      { 'subscription.status': 'active' },
      { new: true } // Return the updated document
    );
    } catch (error) {
      console.log(error);
    }
}

const subscriptionCharged= async(payload:any)=>{
  try {
    const planId=payload.subscription.entity.id;

    await customer.findOneAndUpdate(
      { 'subscription.subscriptionId': planId },
      { 'subscription.status': 'active' },
      { new: true } // Return the updated document
    );
  } catch (error) {
    console.log(error);
  }
}

const subscriptionAuthorized= async(payload:any)=>{
  try {
    const planId=payload.subscription.entity.id;
    console.log("subscription authorized",payload);
    await customer.findOneAndUpdate(
      { 'subscription.subscriptionId': planId },
      { 'subscription.status': 'active' },
      { new: true } // Return the updated document
    );
  }catch (error) {
      console.log(error);
  }
};

const subscriptionCompleted= async(payload:any)=>{
  try {
    const planId=payload.subscription.entity.id;
    console.log("subscription completed",payload);
    await customer.findOneAndUpdate(
    { 'subscription.subscriptionId': planId },
    { 'subscription.status': 'expired' },
    { new: true } // Return the updated document
  );

  } catch (error) {
    console.log(error);
  }
}

const subscriptionCancelled= async(payload:any)=>{
  try {
    const planId=payload.subscription.entity.id;
    console.log("subscription cancelled",payload);
    await customer.findOneAndUpdate(
    { 'subscription.subscriptionId': planId },
    { 'subscription.status': 'cancelled' },
    { new: true } // Return the updated document
  );
  } catch (error) {
    console.log(error);
  }
}

const orderPaid= async(payload:any)=>{
  try {
    console.log("order paid",payload);
    const orderId=payload.order.entity.id;

    await order.findOneAndUpdate(
      { 'razorpayOrderId': orderId },
      { 'status': 'paid' },
      { new: true } // Return the updated document
    );
  } catch (error) {
    console.log(error);
  }
}

const paymentCaptured= async(payload:any)=>{
  try {
    console.log("payment captured",payload);
    const {amount,contact,email,id,order_id,method,currency,status}=payload.payment.entity;

    const newPayment = {
      amount,
      email,
      method,
      currency,
      status,
      rp_payment_id:id,
      rp_order_id:order_id,
      phone:contact,
    };
    
    await Transaction.create(newPayment);
  }
  catch (error) {
    console.log(error);
  }
}


export const paymentWebHook= catchAsyncError(async (req, res, next) => {
  
  try{
    const signature = req.headers["x-razorpay-signature"] as string;
    const secret=config.razorpayWebhookSecret;

    const isValid = validateWebhookSignature(
        JSON.stringify(req.body),
        signature,
        secret
    );
    // console.log(isValid);
    if (isValid) {
      const { event, payload } = req.body;

      console.log(event, payload);

      switch (event) {
        case "payment.authorized":
          {
            console.log("payment authorized");
            break;
          }
        case "payment.captured":
          {
            console.log("payment captured");
            paymentCaptured(payload);
            break;
          }
        case "payment.failed":
         {
            console.log("payment failed");
            break;
         }
         case "order.paid":
         {
            console.log("order paid");
            orderPaid(payload);
            break;
         }
         case "payment_link.paid":
         {
            console.log("payment link paid");
            break;
         }
        case "subscription.authenticated":{
            // console.log("subscription authenticated");
            subscriptionAuthorized(payload);
            break;
        }
        case "subscription.charged":{
            // console.log("subscription charged",event);
            subscriptionCharged(payload);
            break;
        }
        case "subscription.activated":{
            // console.log("subscription activated",event);
            subscriptionActivated(payload);
            break;
        }
        case "subscription.halted":{
            console.log("subscription halted");
            break;
        }
        case "subscription.cancelled":{
            // console.log("subscription cancelled");
            subscriptionCancelled(payload);
            break;
        }
        case "subscription.completed":{
            // console.log("subscription completed");
            subscriptionCompleted(payload);
            break;
        }
        default:
          console.log(`Unhandled event: ${event}`);
          break;
      }
    }
    res.status(200).send("webhook success");
  }
  catch (error) {
    console.log(error);
    res.status(500).send("webhook failed");
  }
});

