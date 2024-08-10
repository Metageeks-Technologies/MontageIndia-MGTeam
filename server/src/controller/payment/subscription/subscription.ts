import catchAsyncError from "@src/middleware/catchAsyncError";
import SubscriptionPlan from "@src/model/subscriptions/subscriptionPlan";
import Razorpay from "razorpay";
import config from "@src/utils/config";
import ErrorHandler from "@src/utils/errorHandler";
import crypto from "crypto";
import { response } from "express";
import customer from "@src/model/user/customer";
/*
index

1. createSubscription
2. createPlan
3. updatePlan
4. fetchAllPlans
5. fetchPlanById
6. verifyPayment
 */

const razorpayInstance=()=>{
    return new Razorpay({
        key_id: config.razorpayKey as string,
        key_secret: config.razorpaySecret as string,
    });
}

export const createPlan= catchAsyncError(async (req, res, next) => {
    const razorpay = razorpayInstance();
    const options :any = {
        period: req.body.period,
        interval: req.body.interval,
        item:req.body.item,
        notes:req.body.notes
    };
   
    const response = await razorpay.plans.create(options);

    if (!response) {
        return next(new ErrorHandler("Error occured while creating Subscription Plan", 404));
    }

    const newPlan = new SubscriptionPlan({
    planId: response.id,
    entity: response.entity,
    interval: response.interval,
    period: response.period,
    total_count: req.body.total_count || 0,
    customer_notify: req.body.customer_notify || false, 
    item: {
        id: response.item.id,
        active: response.item.active,
        name: response.item.name,
        description: response.item.description,
        amount: response.item.amount,
        unit_amount: response.item.unit_amount,
        currency: response.item.currency,
    },
    notes:response.notes
});
    await newPlan.save();
    res.send({
        success: true,
        message: "Subscription Plan created successfully",
        response: response,
        // newPlan
    });
});

export const updatePlan= catchAsyncError(async (req, res, next) => {

    const razorpay:any = razorpayInstance();
    const {name,description,amount,currency,credits,period,interval}=req.body;
    
    const { id } = req.params;
    const options :any = {
        period: period,
        interval: interval,
        item:{
            name:name,
            description:description,
            amount:amount,
            currency:currency
        },
        notes:{
            credits:credits,
        }
    };
    console.log("step 1",options);
    
    const response = await razorpay.plans.create(options);
    console.log("step2",response)

    if (!response) {
        return next(new ErrorHandler("Error occured while creating Subscription Plan", 404));
    }

     const updatedPlanData = {
        planId: response.id,
        entity: response.entity,
        interval: response.interval,
        period: response.period,
        item: {
            id: response.item.id,
            active: response.item.active,
            name: response.item.name,
            description: response.item.description,
            amount: response.item.amount,
            unit_amount: response.item.unit_amount,
            currency: response.item.currency
        },
        notes: {
            credits: response.notes.credits,
        }
    };

    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(id, updatedPlanData, { new: true });

    console.log("step 4",updatedPlan);
    if (!updatedPlan) {
        return next(new ErrorHandler("Subscription Plan not found", 404));
    }

    res.send({
        success: true,
        message: "Subscription Plan updated successfully",
        response: response,
        plan:updatedPlan
    }); 
});

export const fetchAllPlans= catchAsyncError(async (req, res, next) => {

    const response = await SubscriptionPlan.find();
    res.json({
        success: true,
        message: "Subscription Plans fetched successfully",
        response
    });
});

export const fetchPlanById= catchAsyncError(async (req, res, next) => {

    const { id } = req.params;
    const response = await SubscriptionPlan.findOne({ PlanId: id});
    res.json({
        success: true,
        message: "Subscription Plan fetched successfully",
        response
    });
});

export const createSubscription= catchAsyncError(async (req:any, res, next) => {
    const razorpay = razorpayInstance();
    console.log("step1",req.body);
    const options: any = {
        plan_id: req.body.plan_id,
        total_count: req.body.total_count, //The number of billing cycles for which the customer should be charged. For example, if a customer is buying a 1-year subscription billed on a bi-monthly basis, this value should be 6.
        start_at: req.body.start_at,
        expire_by: req.body.expire_by,
        notes: {
            credits: req.body.notes.credits,
        }
    };
    console.log("step2",options);
    const response = await razorpay.subscriptions.create(options);
    console.log("step3",response);
    if(!response){
        return next(new ErrorHandler("Error occured while creating Subscription", 404));
    }
    const updatedCustomer = await customer.findByIdAndUpdate(
    req.user._id,
    {
      'subscription.subscriptionId': response.id,
      'subscription.PlanId': req.body.plan_id,
      'subscription.credits': req.body.notes.credits,
      'subscription.planValidity': req.body.expire_by, // Assuming response.current_end is in Unix timestamp
      'subscription.status': 'initiated',
    },
    { new: true } // Return the updated document
  );

  console.log("step4",updatedCustomer);

  if (!updatedCustomer) {
    return next(new ErrorHandler("Customer not found", 404));
  }


    res.send({
        success: true,
        message: "Subscription created successfully",
        response
    });

});

export const verifyPayment=catchAsyncError(async (req, res, next) => {
        
        console.log("step1",req.body);
        
        const {razorpay_payment_id,razorpay_signature,subscriptionCreationId}=req.body;
        
        const generated_signature=crypto.createHmac('sha256', config.razorpaySecret).update( subscriptionCreationId+ "|" + razorpay_payment_id).digest('hex');

        // // comaparing our digest with the actual signature
        if (generated_signature == razorpay_signature) {
            console.log("Transaction legit!");
        }
        else{
            console.log("Transaction NOT legit!");
        }

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

       res.send({ status:true, response: "Transaction legit!" });
});