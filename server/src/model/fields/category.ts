import mongoose, { Schema } from "mongoose";
import { TField } from "@src/types/field";

const categorySchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
});

const Category = mongoose.model<TField>("Category", categorySchema);

export default Category;
