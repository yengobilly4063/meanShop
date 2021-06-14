import mongoose from 'mongoose';
import { IProduct } from '../interfaces/IProduct';
import { reviewSchema } from './review';
const { Schema } = mongoose;

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  brand: { type: String, default: '' },
  price: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  description: { type: String, required: true },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  // reviews: { type: [reviewSchema] },
  countInStock: { type: Number, required: true, min: 0, max: 255 },
  richDescription: { type: String, default: '' },
  images: { type: [String] },
  dateCreated: { type: Date, default: Date.now },
});

export const Product = mongoose.model('products', productSchema);
