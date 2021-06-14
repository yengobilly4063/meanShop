import mongoose from 'mongoose';
import { IUser } from '../interfaces/IUser';
const { Schema } = mongoose;

export const userSchema = new Schema<IUser>({
	name: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	street: { type: String, required: true },
	apartment: { type: String, default: '' },
	city: { type: String, default: '' },
	zip: { type: String, default: '' },
	country: { type: String, default: '' },
	phone: { type: Number, required: true },
	isAdmin: { type: Boolean, default: false },
});

export const User = mongoose.model('users', userSchema);
