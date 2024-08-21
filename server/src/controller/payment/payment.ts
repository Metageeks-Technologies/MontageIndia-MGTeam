import catchAsyncError from "@src/middleware/catchAsyncError";
import Transaction from "@src/model/transaction/transaction";
import crypto from "crypto";
import config from "@src/utils/config";

export const paymentVerify= catchAsyncError(async (req:any, res, next) => {
   
    const {razorpay_payment_id,razorpay_signature,order_id}=req.body;
    const signature=razorpay_signature as string;
    const secret=config.razorpaySecret;
    // console.log("razorpaysecret",secret,req.body);
    const sig=order_id+"|"+razorpay_payment_id;
    // console.log("sig",sig);

    const generated_signature=crypto.createHmac('sha256', secret).update(sig).digest('hex');

    // console.log("generated_signature",generated_signature,signature);
    if(generated_signature.trim() === signature.trim()){
        res.send({ success:true, message: "Payment Verified" });
    }
    else{
        res.send({ success:false, message: "Transaction NOT legit!" });
    }
});

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

export const getTransactionById = catchAsyncError(async (req, res, next) => {

    const transaction = await Transaction.findById(req.params.id);

});