import mongoose from 'mongoose';
import { ICategory } from '../interfaces/ICategory';
const { Schema } = mongoose;

export const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  color: { type: String },
  icon: { type: String },
  // image: { type: String },
});

export const Category = mongoose.model('categories', categorySchema);
