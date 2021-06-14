import expressJwt from 'express-jwt';
import {Request} from "express"
import dotenv from 'dotenv';
import { IUser } from '../interfaces/IUser';
dotenv.config();

export const authJwt = () => {
	const secret: string = process.env.JWT_SECRET as string;
	const api: string = process.env.API_URL as string;

	return expressJwt({
		secret,
		algorithms: ['HS256'],
		isRevoked: isRevoked
	}).unless({
		path: [
			{ url: /\/api\/v1\/products(.*)/, method: ['GET', 'OPTIONS'] },
			{ url: /\/api\/v1\/categories(.*)/, method: ['GET', 'OPTIONS'] },
			`${api}/users/login`,
			`${api}/users/register`,
		],
	});
};

const isRevoked = async (req: Request, payload: IUser, done: any) => {
	if (!payload.isAdmin) {
		done(null, true)
	}
	done();
}
