import mongoose, { Schema, Document } from 'mongoose';

interface ISubscriptionPlan extends Document {
  name: string;
  description: string;
  price: number;
  duration: string;
  credits: number;
  benefits: string[];
  isDeleted: boolean;
}

const SubscriptionPlanSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },//in days
  credits: { type: Number, required: true },
  benefits: [{ type: String, required: true }],
  isDeleted: { type: Boolean, default: false },
},
{
  timestamps: true
});

const SubscriptionPlan = mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);

export default SubscriptionPlan;
