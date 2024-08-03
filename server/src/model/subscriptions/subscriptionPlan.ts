import mongoose, { Schema, Document } from 'mongoose';

interface ISubscriptionPlan extends Document {
  name: string;
  description: string;
  price: number;
  duration: string;
  credits: number;
  benefits: string[];
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionPlanSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  credits: { type: Number, required: true },
  benefits: { type: [String], required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const SubscriptionPlan = mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);

export default SubscriptionPlan;
