import catchAsyncError from "@src/middleware/catchAsyncError";
import Activity from "@src/model/activity/activity";

export const getActivity = catchAsyncError(async (req, res, next) => {
    
     const { timeRange, searchTerm, dataPerPage, currentPage = 1 } = req.query;

    const objectQuery: any = {};

    // Handling search term
    if (searchTerm && typeof searchTerm === 'string') {
        objectQuery.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { email: { $regex: searchTerm, $options: 'i' } },
            { username: { $regex: searchTerm, $options: 'i' } },
            { action: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: searchTerm, $options: 'i' } },
        ];
    }

    // Handling time range
    if (timeRange && typeof timeRange === 'string') {
        let startDate: Date, endDate: Date;
        const today = new Date();
        switch (timeRange) {
            case 'today':
                startDate = new Date(today.setHours(0, 0, 0, 0));
                endDate = new Date(today.setHours(23, 59, 59, 999));
                break;
            case 'week':
                startDate = new Date(today);
                startDate.setDate(startDate.getDate() - 7);
                endDate = new Date(today);
                break;
            case 'month':
                startDate = new Date(today);
                startDate.setMonth(startDate.getMonth() - 1);
                endDate = new Date(today);
                break;
            case 'year':
                startDate = new Date(today);
                startDate.setFullYear(startDate.getFullYear() - 1);
                endDate = new Date(today);
                break;
            case 'all':
                startDate = new Date(0); // Beginning of time
                endDate = new Date(); // Current date
                break;
            default:
                const timeRangeArray = timeRange.split(',');
                startDate = new Date(timeRangeArray[0]);
                endDate = new Date(timeRangeArray[1]);
                break;
        }
        objectQuery.timestamp = { $gte: startDate, $lte: endDate };
    }

    console.log(objectQuery);

    // Handling pagination
    const limit = parseInt(dataPerPage as string, 10) || 10;
    const skip = (parseInt(currentPage as string, 10) - 1) * limit;

    const activities = await Activity.find(objectQuery).populate('productId',)
        .sort({ timestamp: -1 }) 
        .skip(skip)
        .limit(limit);

    const totalActivities = await Activity.countDocuments(objectQuery);
    const totalPages = Math.ceil(totalActivities / limit);

    res.status(200).json({
        success: true,
        message: "Activity fetched successfully",
        activities,
        totalActivities,
        totalPages,
        currentPage: parseInt(currentPage as string, 10),
        dataPerPage: limit,
    });
});

export const clearActivity = catchAsyncError(async (req, res, next) => {
   
    await Activity.deleteMany();
    res.status(200).json({
        success: true,
        message: "Activity cleared successfully"
    });
});