import { Request, Response } from 'express';
import { User } from '../models/user';
import { comparePassword } from '../utils/hashPassword';
import { generateUserToken } from '../utils/jwtUtil';

export const authUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email: email });
		const passwordMatch = await comparePassword(password, user.password);
		if (user && passwordMatch) {
			const token = await generateUserToken(user);
			res.status(200).json({user: user.email, token: token });
		} else {
			res.status(400).json({ success: false, message: 'Authentication failed, User not found!' });
		}
	} catch (error) {
		return res.status(500).json({ success: false, error: error.mesage, message: 'Internal Server Error' });
	}
};
