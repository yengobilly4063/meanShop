import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { User } from "../models/user"

dotenv.config()


export const userProtected = async (req:Request, res:Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const secret: string = process.env.JWT_SECRET as string;

      token = req.headers.authorization.split(' ')[1];

      const decodedUserInfo: any = jwt.verify(token, secret);

      const user = await User.findById({ _id: decodedUserInfo.userId }).select('-password');

      if (user) req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' });
    }
  }
  if (!token) {
    res.status(401).json({ error: 'Not authorized, No token found' });
  }
}
