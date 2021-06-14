import jwt from 'jsonwebtoken';
import { IUser } from '../interfaces/IUser';
import dotenv from "dotenv"
dotenv.config()

const jwtSecret: string = process.env.JWT_SECRET as string;

export const generateUserToken = async (user: IUser): Promise<Object> => {
  return jwt.sign({isAdmin: user.isAdmin, userId: user.id }, jwtSecret, {
    algorithm: "HS256",
		expiresIn: '30d',
	});
};
