import mongoose, { Schema, Document, Mongoose } from 'mongoose';

interface ISubscriptionHistory extends Document {
  userId: mongoose.Types.ObjectId;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: string;
}

const SubscriptionHistorySchema: Schema = new Schema({
  userId: { type: mongoose.Types.ObjectId,ref:'Customer', required: true },
  planId: { type: String, required: true },
  startDate: { type: Date, default: Date.now() },
  endDate: { type: Date, default: Date.now() },
  status: { type: String, required: true },
}, {
  timestamps: true,
});

const SubscriptionHistory = mongoose.model<ISubscriptionHistory>('SubscriptionHistory', SubscriptionHistorySchema);

export default SubscriptionHistory;
