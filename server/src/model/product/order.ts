import mongoose, { Schema, Document } from 'mongoose';

interface PaymentDetails {
  paymentMethod: string;
  paymentId: string;
  paymentDate: Date;
}

interface OrderProduct {
  productId: string;
  name: string;
  amount: number;
  mediaType: string; // Add mediaType field
}

interface IOrder extends Document {
  userId: string;
  items: OrderProduct[];
  totalAmount: number;
  status: string;
  paymentDetails: PaymentDetails;
  createdAt: Date;
  updatedAt: Date;
}

// models/Order.ts

const PaymentDetailsSchema: Schema = new Schema({
  paymentMethod: { type: String, required: true },
  paymentId: { type: String, required: true },
  paymentDate: { type: Date, required: true },
});

const OrderProductSchema: Schema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  mediaType: { type: String, required: true }, // Add mediaType field
});

const OrderSchema: Schema = new Schema({
  userId: { type: String, required: true },
  items: { type: [OrderProductSchema], required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, required: true },
  paymentDetails: { type: PaymentDetailsSchema, required: true },
}, {
  timestamps: true,
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
