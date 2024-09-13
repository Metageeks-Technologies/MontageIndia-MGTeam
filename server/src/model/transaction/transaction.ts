import mongoose, { Document, Schema } from 'mongoose';

interface ITransaction extends Document
{
    userId?: mongoose.Types.ObjectId;
    name?: string;   
    email?: string;
    phone?: string;
    rp_order_id?: string;
    rp_payment_id?: string;
    amount?: number;
    currency?: string;
    method?: string;
    status?: string;
}

const transactionSchema:Schema = new Schema(
{
    userId:{type: Schema.Types.ObjectId,ref:'Customer'},
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    rp_order_id: {
        type: String,
    },
    rp_payment_id: {
        type: String,
    },
    amount: {
        type: Number,
    },
    currency: {
        type: String,
    },
    method: {
        type: String,
    },
    status: {
        type: String,
    },
},{
    timestamps: true
})

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction