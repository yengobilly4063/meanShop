import mongoose from 'mongoose';
import { IOrderItem } from '../interfaces/IOrderItem';
const { Schema } = mongoose;
export const orderItemSchema = new Schema<IOrderItem>({
  quantity: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }
});

export const OrderItem = mongoose.model('orderItems', orderItemSchema);
