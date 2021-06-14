import { Request, Response } from 'express';
import { User } from '../models/user';
import { hashPassword } from '../utils/hashPassword';

export const getAllUsers = async (req: Request, res: Response) => {
	try {
		const retrievedUsers = await User.find().select(["-password"]);
		res.status(200).json(retrievedUsers);
	} catch (error) {
		res.status(500).json({
			error: error,
			success: false,
			message: 'Failed to retrieve Users',
		});
	}
};

export const getSingleUser = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;

		const retrievedUser = await User.findById({ _id: userId }).select(['-password']);

		if (retrievedUser) {
			return res.status(200).json(retrievedUser);
		} else {
			return res.status(400).json({ success: false, message: 'User not found' });
		}
	} catch (error) {
		res.status(500).json({
			error: error,
			success: false,
			message: 'Failed to retrieve Users',
		});
	}
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
		const { name, email, street, password, apartment, city, zip, country, phone, isAdmin } = req.body;
		const user = User.findById({_id: userId})

		const newPassword = password ? password : user.password
    
    let updateUser = await User.findByIdAndUpdate(
			userId,
			{
				name,
				email,
				street,
				apartment,
				password: newPassword,
				city,
				zip,
				country,
				phone,
				isAdmin,
			},
			{ new: true }
		);
		if (updateUser) {
			return res.status(201).json(updateUser);
		} else {
			return res.status(404).json({
				success: false,
				message: `User with id ${userId} not found`,
			});
		}
	} catch (error) {
		return res.status(500).json({ error: error, message: 'Internal Server Error' });
	}
};

export const createUser = async (req: Request, res: Response) => {
	try {
		const { name, email, password, street, apartment, city, zip, country, phone, isAdmin } = req.body;

		let userFound = await User.findOne({ email: email });
		if (userFound) return res.status(404).json({ success: false, message: `User with email ${email} already exists` });

		let newUser = new User({
			name,
			email,
			password: await hashPassword(password),
			street,
			apartment,
			city,
			zip,
			country,
			phone,
			isAdmin,
		});

		newUser = await newUser.save();
		if (newUser) {
			return res.status(201).json(newUser);
		} else {
			return res.status(400).json({
				success: false,
				message: 'User creation operation failed!',
			});
		}
	} catch (error) {
		return res.status(500).json({
			error: error,
			success: false,
			message: 'Internal Server Error',
		});
	}
};

export const getUserCount = async (req: Request, res: Response) => {
	try {
		const userCount: number = await User.find().countDocuments();
		if (!userCount) {
			return res.status(400).json({ success: false, message: 'No users found' });
		}
		return res.json({ userCount: userCount });
	} catch (error) {
		return res.json(500).json({ error: error, success: false, message: 'Internal Server Error' });
	}
};


export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		let userFound = await User.findByIdAndRemove(userId);
		if (userFound) {
			return res.status(200).json({
				success: true,
				message: `User with id ${userId} successfully deleted`,
			});
		} else {
			return res.status(404).json({
				success: false,
				message: `User with id ${userId} not found`,
			});
		}
	} catch (error) {
		return res.status(400).json({
			error: error,
			success: false,
			message: 'Internal Server Error',
		});
	}
};
