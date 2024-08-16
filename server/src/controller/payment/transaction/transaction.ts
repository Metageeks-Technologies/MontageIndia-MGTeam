import catchAsyncError from "@src/middleware/catchAsyncError";
import Transaction from "@src/model/transaction/transaction";

export const getTransactions = catchAsyncError(async (req, res, next) => {
   const {searchTerm,currentPage,dataPerPage} = req.query;

    const queryObject:any = {};
    if (searchTerm) {
        queryObject.$or = [
            {phone: { $regex: searchTerm, $options: 'i' } },
            {email: { $regex: searchTerm, $options: 'i' } },
            {rp_order_id: { $regex: searchTerm, $options: 'i' } },
            {rp_payment_id: { $regex: searchTerm, $options: 'i' } },
            {method: { $regex: searchTerm, $options: 'i' } },
            {status: { $regex: searchTerm, $options: 'i' } },
        ]
    }

    const limit = parseInt(dataPerPage as string, 10) || 10;
    const skip = (parseInt(currentPage as string, 10) - 1) * limit;

    const transactions = await Transaction.find(queryObject)
        .skip(skip)
        .limit(limit);

    const totalTransactions = await Transaction.countDocuments(queryObject);
    const totalPages = Math.ceil(totalTransactions / limit);

    res.status(200).json({
        success: true,
        transactions,
        totalTransactions,
        totalPages,
        currentPage: parseInt(currentPage as string),
        message: "Transactions fetched successfully",
    });
});
