import mongoose, { Schema, Document } from 'mongoose';
interface IAddress {
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface ICustomer extends Document {
  username: string;
  email: string;
  name: string; // Customer's full name
  password: string;
  isDeleted: boolean;
  cart: mongoose.Types.ObjectId[]; // References to products in the cart
  subscription: {
    credits: number;
    validity: Date | null;
  };
  purchaseHistory: mongoose.Types.ObjectId[]; // References to orders
  subscriptionHistory: mongoose.Types.ObjectId[]; // References to subscriptions
  phone?: string;
  address?: IAddress;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema: Schema<ICustomer> = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true }, // Customer's full name
  password: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  subscription: {
    credits: { type: Number, default: 0 },
    validity: { type: Date, default: null }
  },
  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  subscriptionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' }],
  phone: { type: String },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
