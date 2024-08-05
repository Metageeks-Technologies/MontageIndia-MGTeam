import catchAsyncError from "@src/middleware/catchAsyncError";
import SubscriptionPlan from "@src/model/subscriptions/subscriptionPlan";
import ErrorHandler from "@src/utils/errorHandler";
/*
index

1. createSubscription
2. getSubscription
3. getSubscriptionById
4. updateSubscription
5. deleteSubscription
 */

export const createSubscription = catchAsyncError(async (req, res, next) => {

    if(!req.body){
        return next(new ErrorHandler("Subscription Plan not found", 404));
    }
    console.log(req.body);
    const newPlan = new SubscriptionPlan(req.body);
    const newSubscription = await newPlan.save();
    if (!newSubscription) {
      return next(new ErrorHandler("Error occured while creating Subscription Plan", 404));
    }
    res.json({
      success: true,
      message: "Subscription created successfully",
      newSubscription,
    });
});

export const getSubscription = catchAsyncError(async (req, res, next) => {
    const subscription = await SubscriptionPlan.find();
    if (!subscription) {
      return next(new ErrorHandler("Subscription Plan not found", 404));
    }
    return res.json({ success: true, subscription });
}, "Error occured while getting Subscription Plan");

export const getSubscriptionById =catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const subscription = await SubscriptionPlan.findById(id);
    if (!subscription) {
      return next(new ErrorHandler("Subscription Plan not found", 404));
    }
    return res.json({ success: true, subscription });
}, "Error occured while getting Subscription Plan");

export const updateSubscription = catchAsyncError(async (req, res, next) => {
    if(!req.body){
        return next(new ErrorHandler("invalid request", 404));
    }
    const { id } = req.params;
    const subscription = await SubscriptionPlan.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!subscription) {
      return next(new ErrorHandler("Subscription Plan not found", 404));
    }
    return res.json({ success: true, subscription });
}, "Error occured while updating Subscription Plan");

export const deleteSubscription = catchAsyncError(async (req, res, next) => {
    
    const { id } = req.params;
    const subscription = await SubscriptionPlan.findById(id);
    if (!subscription) {
      return next(new ErrorHandler("Subscription Plan not found", 404));
    }
    subscription.isDeleted = true;
    await subscription.save();
    if (!subscription) {
      return next(new ErrorHandler("Error occured while deleting Subscription Plan", 404));
    }
    return res.json({ success: true, subscription });
}, "Error occured while deleting Subscription Plan");
