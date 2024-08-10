import mongoose, { Schema, Document } from 'mongoose';

interface IOrder extends Document {
  userId: string;
  razorpayOrderId?: string;
  productIds: mongoose.Schema.Types.ObjectId[];
  currency: string;
  totalAmount: number;
  status: string;
  method:string;
}

const OrderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  razorpayOrderId: { type: String },
  productIds: [{type:mongoose.Schema.Types.ObjectId,ref:'Product'}],
  totalAmount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid',"completed", 'cancelled'], required: true },
  method:{type:String,enum:['razorpay','credit'],required:true},
}, {
  timestamps: true,
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
