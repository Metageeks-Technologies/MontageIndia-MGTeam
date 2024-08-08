import catchAsyncError from "@src/middleware/catchAsyncError.js";
import config from "@src/utils/config";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

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
         case "payment_link.partially_paid":
         {
            console.log("payment link partially paid");
            break;
         }
         case "payment_link.expired":{
            console.log("payment link expired");
            break;
         }
         case "payment_link.cancelled":{
            console.log("payment link cancelled");
            break;
         }
        case "subscription.authenticated":{
            console.log("subscription authenticated");
            break;
        }
        case "subscription.charged":{
            console.log("subscription charged");
            break;
        }
        case "subscription.activated":{
            console.log("subscription activated");
            break;
        }
        case "subscription.paused":{
            console.log("subscription paused");
            break;
        }
        case "subscription.resumed":{
            console.log("subscription resumed");
            break;
        }
        case "subscription.pending":{
            console.log("subscription pending");
            break;
        }
        case "subscription.halted":{
            console.log("subscription halted");
            break;
        }
        case "subscription.cancelled":{
            console.log("subscription cancelled");
            break;
        }
        case "subscription.completed":{
            console.log("subscription completed");
            break;
        }
        default:
          console.log(`Unhandled event: ${event}`);
          break;
      }
    }
   res.status(200).send();
  
});

