import mongoose, { Schema, Document } from 'mongoose';

interface IOrderProduct extends Document {
  productId: string;
  name: string;
  amount: number;
  mediaType: string;
}

const OrderProductSchema: Schema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  mediaType: { type: String, required: true },
}, {
  timestamps: true,
});

const OrderProduct = mongoose.model<IOrderProduct>('OrderProduct', OrderProductSchema);

export default OrderProduct;
