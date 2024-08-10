import catchAsyncError from "@src/middleware/catchAsyncError";
import Transaction from "@src/model/transaction/transaction";

export const getTransactions = catchAsyncError(async (req, res, next) => {
  const transactions = await Transaction.find();
  res.status(200).json({
    success: true,
    transactions,
  });
});
