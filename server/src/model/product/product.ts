import mongoose from "mongoose";
import { TProduct } from "@src/types/product";

const productSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String, required: true }],
    category: [{ type: String, required: true }],
    publicKey: { type: String },
    thumbnailKey: { type: String },
    variants: [
      {
        label: { type: String },
        price: { type: Number },
        credit: { type: Number, default: 10 },
        key: { type: String },
        metadata: {
          format: { type: String, required: true },
          length: { type: Number },
          size: { type: Number, required: true },
          dimension: { type: String },
          dpi: { type: Number },
          bitrate: { type: Number },
          resolution: { type: String },
          frameRate: { type: Number },
        },
      },
    ],
    status: {
      type: String,
      enum: ["published", "archived", "unavailable", "draft"],
      required: true,
      default: "draft",
    },
    mediaType: {
      type: String,
      enum: ["image", "video", "audio"],
      required: true,
    },
    length: { type: Number },
    height: { type: Number },
    width: { type: Number },
    createdBy: { type: mongoose.Schema.Types.ObjectId },
  },
  { timestamps: true }
);

productSchema.index({
  title: "text",
  description: "text",
  category: "text",
  tags: "text",
});

const Product = mongoose.model<TProduct & mongoose.Document>(
  "Product",
  productSchema
);

export default Product;
