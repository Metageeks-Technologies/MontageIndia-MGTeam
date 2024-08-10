import mongoose, { Schema, Document } from 'mongoose';

interface ISubscriptionHistory extends Document {
  userId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

const SubscriptionHistorySchema: Schema = new Schema({
  userId: { type: String, required: true },
  planId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, required: true },
}, {
  timestamps: true,
});

const SubscriptionHistory = mongoose.model<ISubscriptionHistory>('SubscriptionHistory', SubscriptionHistorySchema);

export default SubscriptionHistory;
