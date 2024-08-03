import mongoose, { Schema, Document } from 'mongoose';
import * as validator from 'validator';
import type { TCustomer } from "../../types/user";

const CustomerSchema: Schema<TCustomer> = new Schema({
  name: {
    type: String,
    required: [true, "please enter your name"],
    maxlength: [30, "name can't exceed 30 characters"],
    minlength: [4, "name should have more than 4 characters"],
    trim: true,
    default: "none"
  },
  username:{
    type: String,
    required: [true, "please enter your username"],
    maxlength: [30, "username can't exceed 30 characters"],
    minlength: [4, "username should have more than 4 characters"],
    trim: true,
    default: "none",
    unique: true,
  },
  email:{
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    validate: [validator.isEmail, "please enter a valid email"],
  },
  password: {
    type: String,
    minlength: [6, "password should have a minimum of 6 characters"],
    select: false,
  },
  isDeleted: { type: Boolean, default: false },
  credits: { type: Number, default: 0 },
  creditsValidity: { type: Date, default: null },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  subscription: { type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' },
  purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  subscriptionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubscriptionPlan' }],
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Customer = mongoose.model<TCustomer>('Customer', CustomerSchema);

export default Customer;
