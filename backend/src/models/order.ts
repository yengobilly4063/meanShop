import mongoose from 'mongoose';
import { IOrder } from '../interfaces/IOrder';
const { Schema } = mongoose;
export const orderSchema = new Schema<IOrder>({
	shippingAddress1: { type: String, required: true },
	shippingAddress2: { type: String },
	city: { type: String, required: true },
	zip: { type: String, required: true },
	country: { type: String, required: true },
	phone: { type: String, required: true },
	status: { type: String, required: true, default: 'pending' },
	totalPrice: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', requred: true },
  dateOrdered: {type: Date, default: Date.now},
	orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem', requred: true }],
});

export const Order = mongoose.model('orders', orderSchema);
