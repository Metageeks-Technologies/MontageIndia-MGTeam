import catchAsyncError from "@src/middleware/catchAsyncError.js";
import customer from "@src/model/user/customer";
import order from "@src/model/product/order";
import crypto from "crypto";
import config from "@src/utils/config";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";
import Transaction from "@src/model/transaction/transaction";
import SubscriptionHistory from "@src/model/subscriptions/subscriptionHistory";
import { sendEmail } from "@src/utils/nodemailer/mailer/mailer";
import mongoose from "mongoose";

const sendNotification = async (payload: any) => {
  console.log("for email", payload);
  const { email, order_id, amount, currency, created_at } =
    payload.payment.entity;
  if (!email) return;
  const date = new Date(created_at * 1000);
  const formatedDate = date.toISOString().slice(0, 19).replace("T", " ");

  const mailOptions = {
    from: config.emailUser as string,
    to: email as string,
    subject: "Payment Confirmation" as string,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #4CAF50;
          }
          p {
            font-size: 16px;
            line-height: 1.6;
          }
          .order-details {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
          .order-details h2 {
            margin: 0 0 10px;
          }
          .order-details p {
            margin: 5px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Payment Confirmation</h1>
          <p>Dear ${email},</p>
          <p>Thank you for your order! We are pleased to confirm that your payment has been successfully processed. Your order details are as follows:</p>
          
          <div class="order-details">
            <h2>Order Details</h2>
            <p><strong>Order Number:</strong> ${order_id}</p>
            <p><strong>Order Date:</strong> ${formatedDate}</p>
            <p><strong>Total Amount:</strong> ${amount / 100} ${currency}</p>
          </div>
          
          <p>Thank you for shopping with us!</p>
          
          <p>Best regards,<br>Montage India</p>
          
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Montage India. All rights reserved.</p>
            <p>India</p>
          </div>
        </div>
      </body>
      </html>
    ` as string,
  };

  sendEmail(mailOptions)
    .then(() => {
      console.log("Email sent successfully");
    })
    .catch((error) => {
      console.error("Failed to send email:", error);
    });
};

const subscriptionCharged = async (payload: any) => {
  try {
    console.log("subscription charged", payload);
    const { start_at, end_at, status, expire_by, plan_id, id, notes } =
      payload.subscription.entity;
    console.log("Notes", notes);
    const user = await customer.findOneAndUpdate(
      { "subscription.subscriptionId": id },
      {
        $set: {
          "subscription.status": status,
          "subscription.PlanId": notes.subscriptionId as string,
        },
        $inc: { "subscription.credits": notes.credits },
      },
      { new: true } // Return the updated document
    );
    if (!user) return;
    // console.log("user",user);
    await SubscriptionHistory.create({
      userId: user?._id,
      planId: plan_id,
      startDate: start_at,
      endDate: end_at,
      status: status,
    });
  } catch (error) {
    console.log(error);
  }
};
const subscriptionHandler = async (payload: any) => {
  try {
    // console.log("subscription handler",payload);
    const { start_at, end_at, status, expire_by, plan_id, id } =
      payload.subscription.entity;

    const user = await customer.findOneAndUpdate(
      { "subscription.subscriptionId": id },
      { "subscription.status": status },
      { new: true } // Return the updated document
    );
    if (!user) return;
    console.log("user", user);
    await SubscriptionHistory.create({
      userId: user?._id,
      planId: plan_id,
      startDate: start_at,
      endDate: end_at,
      status: status,
    });
  } catch (error) {
    console.log(error);
  }
};

const orderPaid = async (payload: any) => {
  try {
    console.log("order paid", payload);
    const orderId = payload.order.entity.id;

    const Order = await order.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { status: "paid" },
      { new: true } // Return the updated document
    );
    console.log(Order);

    if (!Order) return;

    const userId = Order?.userId;
    const products = Order?.products;

    const user = await customer.findById(userId);
    if (!user) return;

    console.log("user", user);

    for (const product of products) {
      const { productId, variantId } = product;

      const existingProduct = user.purchasedProducts.find(
        (item) => item.productId.toString() === productId.toString()
      );

      if (existingProduct) {
        const existingVariant =
          existingProduct.variantId.toString() === variantId.toString();
        if (existingVariant) {
          throw new Error("Product with the same variant ID already exists.");
        } else {
          // Add a new entry with the product ID and new variant ID
          user.purchasedProducts.push({
            productId: productId,
            variantId: variantId,
          });
        }
      } else {
        // Add the new product with variant ID
        user.purchasedProducts.push({
          productId: productId,
          variantId: variantId,
        });
      }
    }

    // Clear the user's cart after purchase
    user.cart = [];
    await user.save();

    // Send a notification (function call)
    await sendNotification(payload);
  } catch (error) {
    console.log(error);
  }
};

const paymentHandler = async (payload: any) => {
  try {
    console.log("payment handler", payload);
    const { amount, contact, email, id, order_id, method, currency, status } =
      payload.payment.entity;

    const Order = await order.findOne({ razorpayOrderId: order_id });
    if (!Order) return;
    console.log(Order);
    const userId = Order?.userId;

    const newPayment = {
      userId: userId ? userId : "",
      amount,
      email,
      method,
      currency,
      status,
      rp_payment_id: id,
      rp_order_id: order_id ? order_id : "",
      phone: contact,
    };

    await Transaction.create(newPayment);
  } catch (error) {
    console.log(error);
  }
};

export const paymentWebHook = catchAsyncError(async (req, res, next) => {
  const secret = config.razorpayWebhookSecret;

  const signature = req.headers["x-razorpay-signature"] as string;
  const body = JSON.stringify(req.body);

  const isValid = validateWebhookSignature(body, signature, secret);

  if (isValid) {
    const { event, payload } = req.body;

    console.log(event, payload);

    switch (event) {
      case "payment.authorized":
      case "payment.captured":
      case "payment.failed": {
        console.log("payment");
        paymentHandler(payload);
        break;
      }
      case "order.paid": {
        console.log("order paid");
        orderPaid(payload);
        break;
      }

      case "subscription.charged": {
        subscriptionCharged(payload);
        break;
      }
      case "subscription.authenticated":
      case "subscription.cancelled":
      case "subscription.completed": {
        subscriptionHandler(payload);
        break;
      }
      default:
        console.log(`Unhandled event: ${event}`);
        break;
    }
    res.status(200).send("webhook success");
  } else {
    res.status(400).send("Invalid signature");
  }
});
