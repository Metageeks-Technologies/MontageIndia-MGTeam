import catchAsyncError from "@src/middleware/catchAsyncError.js";
import customer from "@src/model/user/customer";
import config from "@src/utils/config";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

const subscriptionActivated= async(event:any,payload:any)=>{
  try {
    console.log("subscription activated",payload);
    const planId=payload.subscription.entity.id;

    const user = await customer.findOneAndUpdate(
    { 'subscription.subscriptionId': planId },
    { 'subscription.status': 'active' },
    { new: true } // Return the updated document
  );

if(!user){
  console.log("no user found");
}
console.log("user",user);
  } catch (error) {
    console.log(error);
  }
}

const subscriptionCharged= async(event:any,payload:any)=>{
  try {
    const planId=payload.subscription.entity.id;

    const user = await customer.findOneAndUpdate(
    { 'subscription.subscriptionId': planId },
    { 'subscription.status': 'active' },
    { new: true } // Return the updated document
  );
  

if(!user){
  console.log("no user found");
}
  } catch (error) {
    console.log(error);
  }
}

const subscriptionAuthorized= async(event:any,payload:any)=>{
  try {
    const planId=payload.subscription.entity.id;
    console.log("subscription authorized",payload);
    const user = await customer.findOneAndUpdate(
    { 'subscription.subscriptionId': planId },
    { 'subscription.status': 'active' },
    { new: true } // Return the updated document
  );

    if(!user){
      console.log("no user found");
    }
    console.log("user",user);
      } catch (error) {
        console.log(error);
      }
};

const subscriptionCompleted= async(event:any,payload:any)=>{
  try {
    const planId=payload.subscription.entity.id;
    console.log("subscription completed",payload);
    const user = await customer.findOneAndUpdate(
    { 'subscription.subscriptionId': planId },
    { 'subscription.status': 'expired' },
    { new: true } // Return the updated document
  );

  } catch (error) {
    console.log(error);
  }
}

const subscriptionCancelled= async(event:any,payload:any)=>{
  try {
    const planId=payload.subscription.entity.id;
    console.log("subscription cancelled",payload);
    const user = await customer.findOneAndUpdate(
    { 'subscription.subscriptionId': planId },
    { 'subscription.status': 'cancelled' },
    { new: true } // Return the updated document
  );
  } catch (error) {
    console.log(error);
  }
}


export const paymentWebHook= catchAsyncError(async (req, res, next) => {
    const signature = req.headers["x-razorpay-signature"] as string;
    const isValid = validateWebhookSignature(
        JSON.stringify(req.body),
        signature,
        config.razorpayWebhookSecret
    );
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
            break;
         }
         case "payment_link.paid":
         {
            console.log("payment link paid");
            break;
         }
        case "subscription.authenticated":{
            // console.log("subscription authenticated");
            subscriptionAuthorized(event,payload);
            break;
        }
        case "subscription.charged":{
            // console.log("subscription charged",event);
            subscriptionCharged(event,payload);
            break;
        }
        case "subscription.activated":{
            // console.log("subscription activated",event);
            subscriptionActivated(event,payload);
            break;
        }
        case "subscription.halted":{
            console.log("subscription halted");
            break;
        }
        case "subscription.cancelled":{
            // console.log("subscription cancelled");
            subscriptionCancelled(event,payload);
            break;
        }
        case "subscription.completed":{
            // console.log("subscription completed");
            subscriptionCompleted(event,payload);
            break;
        }
        default:
          console.log(`Unhandled event: ${event}`);
          break;
      }
    }
   res.status(200).send();
  
});

