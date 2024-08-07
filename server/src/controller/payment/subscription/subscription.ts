import catchAsyncError from "@src/middleware/catchAsyncError";
import SubscriptionPlan from "@src/model/subscriptions/subscriptionPlan";
import Razorpay from "razorpay";
import config from "@src/utils/config";
import ErrorHandler from "@src/utils/errorHandler";
/*
index

1. createSubscription
2. getSubscription
3. getSubscriptionById
4. updateSubscription
5. deleteSubscription
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

// console.log("step 3",newPlan);


    await newPlan.save();
    res.send({
        success: true,
        message: "Subscription Plan created successfully",
        response: response,
        newPlan
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

export const createSubscription= catchAsyncError(async (req, res, next) => {
    const razorpay = razorpayInstance();
    console.log("step1",req.body);
    const options: any = {
        plan_id: req.body.plan_id,
        total_count: req.body.total_count, //The number of billing cycles for which the customer should be charged. For example, if a customer is buying a 1-year subscription billed on a bi-monthly basis, this value should be 6.
        start_at: req.body.start_at,
        expire_by: req.body.expire_by,
        notes: {
            credits: req.body.notes.credits,
            validity: req.body.notes.validity
        }
    };
    console.log("step2",options);
    const response = await razorpay.subscriptions.create(options);
    console.log("step3",response);
    if(!response){
        return next(new ErrorHandler("Error occured while creating Subscription", 404));
    }
    res.send({
        success: true,
        message: "Subscription created successfully",
        response
    });

});