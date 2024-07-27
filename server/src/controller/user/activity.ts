import catchAsyncError from "@src/middleware/catchAsyncError";
import Activity from "@src/model/activity/activity";
import ErrorHandler from "@src/utils/errorHandler";


export const getActivity = catchAsyncError(async (req, res, next) => {
    try {
        const activities = await Activity.find();
        res.status(200).json({
            success: true,
            message: "Activity fetched successfully",
            activities
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        });
    }
});

export const clearActivity = catchAsyncError(async (req, res, next) => {
    try {
        await Activity.deleteMany();
        res.status(200).json({
            success: true,
            message: "Activity cleared successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        });
    }
});