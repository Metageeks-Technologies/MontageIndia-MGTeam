import mongoose from "mongoose";
import type {TEmcMedia} from '@src/types/product'

const emcJobSchema = new mongoose.Schema({
    uuid:{type: String, required: true},
    mainJobId:{type: String, required: true},
    watermarkJobId:{type: String, required: true},
    product: { type: mongoose.Schema.Types.ObjectId}
});

const EmcMedia = mongoose.model<TEmcMedia & mongoose.Document>('EmcMedia', emcJobSchema);
export default EmcMedia;