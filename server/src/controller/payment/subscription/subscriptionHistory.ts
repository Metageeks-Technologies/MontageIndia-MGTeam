import catchAsyncError from "@src/middleware/catchAsyncError";
import SubscriptionHistory from "@src/model/subscriptions/subscriptionHistory";

export const getSubscriptionHistory = catchAsyncError(async (req, res, next) => {
    const subscriptionHistory = await SubscriptionHistory.find();
    res.status(200).json({
        success: true,
        subscriptionHistory
    });
});


