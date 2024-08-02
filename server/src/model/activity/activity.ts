
import mongoose, { Schema, Document } from 'mongoose';

interface IActivity extends Document {
  adminId: mongoose.Types.ObjectId;
  name: string;
  username: string;
  email: string;
  action: string;
  category: string;
  productId: mongoose.Types.ObjectId;
  timestamp: Date;
}

const ActivitySchema: Schema = new Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  action: { type: String, enum: ['create', 'update', 'delete'], required: true },
  category: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  timestamp: { type: Date, default: Date.now },
});

const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity;
