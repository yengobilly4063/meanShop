import mongoose from 'mongoose';
import { IReview } from '../interfaces/IReview';
const { Schema } = mongoose;

export const reviewSchema = new Schema<IReview>({
  content: { type: String },
});

export const Review = mongoose.model('reviews', reviewSchema);
