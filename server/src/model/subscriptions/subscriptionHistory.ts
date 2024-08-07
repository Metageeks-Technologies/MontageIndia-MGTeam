import mongoose, { Schema, Document } from 'mongoose';

interface PaymentDetails {
  paymentMethod: string;
  paymentId: string;
  paymentDate: Date;
}

interface AccessDetails {
  creditsAdded: number;
  validationOfCredits: boolean;
}

interface ISubscriptionHistory extends Document {
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: string;
  paymentDetails: PaymentDetails;
  accessDetails: AccessDetails;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentDetailsSchema: Schema = new Schema({
  paymentMethod: { type: String, required: true },
  paymentId: { type: String, required: true },
  paymentDate: { type: Date, required: true },
});

const AccessDetailsSchema: Schema = new Schema({
  creditsAdded: { type: Number, required: true },
  validationOfCredits: { type: Boolean, required: true },
});

const SubscriptionHistorySchema: Schema = new Schema({
  userId: { type: String, required: true },
  planId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, required: true },
  paymentDetails: { type: PaymentDetailsSchema, required: true },
  accessDetails: { type: AccessDetailsSchema, required: true },
}, {
  timestamps: true,
});

const SubscriptionHistory = mongoose.model<ISubscriptionHistory>('SubscriptionHistory', SubscriptionHistorySchema);

export default SubscriptionHistory;
