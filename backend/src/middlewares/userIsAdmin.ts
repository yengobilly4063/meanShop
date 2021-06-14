import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { User } from '../models/user';
import { IUser } from '../interfaces/IUser';

dotenv.config();



export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  // Can be simplified to just validate req.user as we have already tested for token/login in userProtected
	let token;
	if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
		try {
			const secret: string = process.env.JWT_SECRET as string;

			token = req.headers.authorization.split(' ')[1];

			const decodedUserInfo: any = jwt.verify(token, secret);

      const user:IUser = await User.findById({ _id: decodedUserInfo.userId }).select('-password');
      
      if (!user.isAdmin) {
        return res.status(401).json({error: "Unauthorized, no admin priviledge!"})
      }
      req.user = user
			next();
		} catch (error) {
			res.status(401).json({ error: 'Invalid token' });
		}
	}
	if (!token) {
		res.status(401).json({ error: 'Not authorized, No token found' });
	}
};

// export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
// 	const user: any = req.user;
// 	if (!user.isAdmin) {
// 		return res.status(401).json({ error: 'Unauthorized, no admin priviledge!' });
// 	}
// 	next();
// };
