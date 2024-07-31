
import mongoose, { Schema } from 'mongoose';
import  { TField } from '@src/types/field';


const categorySchema: Schema = new Schema({
  name: { type: String, required: true },
});

const Category = mongoose.model<TField>('Category', categorySchema);

export default Category;
