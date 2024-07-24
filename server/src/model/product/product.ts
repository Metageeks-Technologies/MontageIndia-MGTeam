import mongoose from "mongoose";
import { TProduct } from "@src/types/product";

const productSchema = new mongoose.Schema({
    uuid:{type: String, required: true ,unique:true},
    slug:{type: String, required: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    publicKey: { type: String },
    thumbnailKey:{type: String },
    variants: [{
        label: { type: String },
        price: { type: Number},
        key: { type: String}
    }],
    status: { type: String, enum: ["published", "archived", "unavailable","draft"], required: true },
    mediaType: { type: String, enum: ["image", "video", "audio"], required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, required: true}
});

const ProductModel = mongoose.model<TProduct & mongoose.Document>('Product', productSchema);

export default ProductModel;