import mongoose, { Document, Schema } from 'mongoose';

interface ISubscriptionPlan extends Document {
    planId: string;
    entity: string;
    interval: number;
    period: string;
    total_count: number;
    customer_notify: number;
    item: {
        id: string;
        active: boolean;
        name: string;
        description: string;
        amount: number;
        unit_amount: number;
        currency: string;
    };
    notes: {
        credits: number;
        validity: number;
    };
}

const SubscriptionPlanSchema: Schema = new Schema({
    planId: { type: String, required: true },
    entity: { type: String, required: true },
    interval: { type: Number, required: true },
    total_count: { type: Number, required: true },
    customer_notify: { type: Number,enum: [0, 1], required: true },
    period: { type: String,enum: ['daily', 'weekly', 'monthly','quarterly', 'yearly'], required: true },
    item: {
        id: { type: String, required: true },
        active: { type: Boolean, required: true },
        name: { type: String, required: true },
        description: { type: String },
        amount: { type: Number, required: true },
        unit_amount: { type: Number, required: true },
        currency: { type: String, required: true },
    },
    notes: {
        credits: { type: Number, required: true },
        validity: { type: Number, required: true },
    },
}, {
  timestamps: true
});

const SubscriptionPlan = mongoose.model<ISubscriptionPlan>('SubscriptionPlan', SubscriptionPlanSchema);
export default SubscriptionPlan;
