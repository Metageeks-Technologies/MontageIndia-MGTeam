import mongoose, { Schema, Document } from 'mongoose';

export interface ProductItem {
  productId: mongoose.Schema.Types.ObjectId;
  variantId: string;
}
interface IOrder extends Document {
  userId: string;
  razorpayOrderId?: string;
  products: ProductItem[];
  currency: string;
  totalAmount: number;
  status: string;
  method:string;
}

const OrderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  razorpayOrderId: { type: String },
  products: [{
    productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' ,
    },
    variantId: {type:String},
  }],
  totalAmount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid',"completed", 'cancelled'], required: true },
  method:{type:String,enum:['razorpay','credit'],required:true},
}, {
  timestamps: true,
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
