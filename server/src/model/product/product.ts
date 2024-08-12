import mongoose from "mongoose";
import { TProduct } from "@src/types/product";

const productSchema = new mongoose.Schema({
    uuid:{type: String, required: true ,unique:true},
    slug:{type: String, required: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String ,required:true}],
    category:[{ type: String, required: true }],
    publicKey: { type: String },
    thumbnailKey:{type: String },
    variants: [{
        label: { type: String },
        size:{type:String},
        price: { type: Number},
        credit: { type: Number ,default:10},
        key: { type: String}
    }],
    status: { type: String, enum: ["published", "archived", "unavailable","draft"], required: true ,default:"draft"},
    mediaType: { type: String, enum: ["image", "video", "audio"], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId}
},{timestamps:true});

const Product = mongoose.model<TProduct & mongoose.Document>('Product', productSchema);

export default Product;