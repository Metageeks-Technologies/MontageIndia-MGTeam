import mongoose, { Document, Schema } from 'mongoose';

interface ITransaction extends Document
{
    userId: mongoose.Types.ObjectId;
    name: string;   
    email: string;
    phone: string;
    rp_order_id: string;
    rp_payment_id: string;
    amount: number;
    currency: string;
    method: string;
    status: string;
}

const transactionSchema:Schema = new Schema(
{
    userId:{type: Schema.Types.ObjectId,ref:'Customer'},
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    rp_order_id: {
        type: String,
        // required: true
    },
    rp_payment_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction