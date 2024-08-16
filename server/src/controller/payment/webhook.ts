import catchAsyncError from "@src/middleware/catchAsyncError.js";
import customer from "@src/model/user/customer";
import order from '@src/model/product/order';
import crypto from "crypto";
import config from "@src/utils/config";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import Transaction from "@src/model/transaction/transaction";
import SubscriptionHistory from "@src/model/subscriptions/subscriptionHistory";
import mongoose from "mongoose";

const subscriptionCharged= async(payload:any)=>{
  try {
    console.log("subscription charged",payload);
    const {start_at,end_at,status,expire_by,plan_id,id,notes}=payload.subscription.entity;

    const user = await customer.findOneAndUpdate(
      { 'subscription.subscriptionId': id },
      {
        $set: { 
          'subscription.status': status,
          'subscription.PlanId': plan_id 
        },
        $inc: { 'subscription.credits': notes.credits}
      },
      { new: true } // Return the updated document
    );
    if(!user) return;
    console.log("user",user);
    await SubscriptionHistory.create(
      {
        userId: user?._id,
        planId:plan_id,
        startDate:start_at,
        endDate:end_at,
        status: status,
      });
  }
  catch (error) {
    console.log(error);
  }
}
const subscriptionHandler= async(payload:any)=>{
  try {
    console.log("subscription handler",payload);
    const {start_at,end_at,status,expire_by,plan_id,id}=payload.subscription.entity;

    const user=await customer.findOneAndUpdate(
      { 'subscription.subscriptionId': id },
      { 'subscription.status': status },
      { new: true } // Return the updated document
    );
    if(!user) return;
    console.log("user",user);
    await SubscriptionHistory.create(
      {
        userId: user?._id,
        planId:plan_id,
        startDate:start_at,
        endDate:end_at,
        status: status,
      });
  } catch (error) {
    console.log(error);
  }
}

const orderPaid= async(payload:any)=>{
  try {
    console.log("order paid",payload);
    const orderId=payload.order.entity.id;

    const Order=await order.findOneAndUpdate(
      { 'razorpayOrderId': orderId },
      { 'status': 'paid' },
      { new: true } // Return the updated document
    );
    console.log(Order);

    if(!Order) return;

    const userId=Order?.userId;
    const products=Order?.products;

    const user = await customer.findById(userId);
    if(!user) return;

    console.log("user",user);

    for (const product of products) {
      const { productId, variantId } = product;

      const productIdString = productId.toString();
      const existingProductIndex = user.purchasedProducts.findIndex(p => p.productId.toString() === productIdString);

      if (existingProductIndex > -1) {
          if (!user.purchasedProducts[existingProductIndex].variantId.includes(variantId)) {
              user.purchasedProducts[existingProductIndex].variantId.push(variantId);
          }
      } else {
          const productId=new mongoose.Types.ObjectId(productIdString);
          user.purchasedProducts.push({
              productId: productId,
              variantId: [variantId],
          });
            }
    }

    await user.save();
    
  } catch (error) {
    console.log(error);
  }
}

const invoicePaid= async(payload:any)=>{
  try {
    console.log("invoice paid",payload);
  }
  catch(error){
    
  }
}

const paymentAuthorized=async(payload:any)=>{
  try {
     console.log("payment handler",payload);
    const {amount,contact,email,id,order_id,method,currency,status}=payload.payment.entity;

    const Order=await order.findOne(
      { 'razorpayOrderId': order_id },
    );
    if(!Order) return;
    console.log(Order);
    const userId=Order?.userId;
    
    const newPayment = {
      userId:userId?userId:"",
      amount,
      email,
      method,
      currency,
      status,
      rp_payment_id:id,
      rp_order_id:order_id?order_id:"",
      phone:contact,
    };
    
    await Transaction.create(newPayment);

    const products=Order?.products;

    const user = await customer.findById(userId);
    if(!user) return;

    console.log("user",user);

    for (const product of products) {
      const { productId, variantId } = product;

      const productIdString = productId.toString();
      const existingProductIndex = user.purchasedProducts.findIndex(p => p.productId.toString() === productIdString);

      if (existingProductIndex > -1) {
          if (!user.purchasedProducts[existingProductIndex].variantId.includes(variantId)) {
              user.purchasedProducts[existingProductIndex].variantId.push(variantId);
          }
      } else {
          const productId=new mongoose.Types.ObjectId(productIdString);
          user.purchasedProducts.push({
              productId: productId,
              variantId: [variantId],
          });
            }
    }

    await user.save();

  } catch (error) {
    console.log(error);
  }
}
const paymentHandler= async(payload:any)=>{
  try {
    console.log("payment handler",payload);
    const {amount,contact,email,id,order_id,method,currency,status}=payload.payment.entity;

    const Order=await order.findOne(
      { 'razorpayOrderId': order_id },
    );
    if(!Order) return;
    console.log(Order);
    const userId=Order?.userId;
    
    const newPayment = {
      userId:userId?userId:"",
      amount,
      email,
      method,
      currency,
      status,
      rp_payment_id:id,
      rp_order_id:order_id?order_id:"",
      phone:contact,
    };
    
    await Transaction.create(newPayment);
  }
  catch (error) {
    console.log(error);
  }
}

export const paymentWebHook= catchAsyncError(async (req, res, next) => {
  
    const secret=config.razorpayWebhookSecret;

    const signature = req.headers['x-razorpay-signature'] as string;
    const body=JSON.stringify(req.body);
    
    const isValid = validateWebhookSignature(body, signature, secret);
    
    if (isValid) {
      const { event, payload } = req.body;

      console.log(event, payload);

      switch (event) {
        case "payment.authorized":
        case "payment.captured":
        case "payment.failed":
          {
            console.log("payment");
            paymentHandler(payload);
            break;
          }
        case "order.paid":
         {
            console.log("order paid");
            orderPaid(payload);
            break;
         }
         case "invoice.paid":{
            console.log("invoice paid");
            invoicePaid(payload);
            break;
         }
         case "subscription.charged":{
          subscriptionCharged(payload);
          break;
         }
        case "subscription.authenticated":
        case "subscription.cancelled":
        case "subscription.completed": 
        {
            subscriptionHandler(payload);
            break;
        }
        default:
          console.log(`Unhandled event: ${event}`);
          break;
      }
      res.status(200).send("webhook success");
    }
    else{
      res.status(400).send('Invalid signature');
    }
});

