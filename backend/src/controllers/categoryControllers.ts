import { Request, Response } from 'express';
import { Category } from '../models/category';

export const getAllCategories = async (req: Request, res: Response) => {
	try {
		const retrievedCategories = await Category.find();
		return res.status(200).json(retrievedCategories);
	} catch (error) {
		return res.status(500).json({
			error: error,
			success: false,
			message: 'Failed to retrieve Categories',
		});
	}
};

export const createCategory = async (req: Request, res: Response) => {
	try {
		const { name, icon, color } = req.body;
		let newCategory = new Category({ name, icon, color });
		newCategory = await newCategory.save();
		if (!newCategory) {
			return res.status(400).json({ success: false, message: 'Category could not be created' });
		}
		return res.json(newCategory);
	} catch (error) {
		return res.json({
			error: error,
			success: false,
			message: 'Failed to create Category',
		});
	}
};

export const deleteCategory = async (req: Request, res: Response) => {
	try {
		const { categoryId } = req.params;
		let categoryFound = await Category.findByIdAndRemove(categoryId);
		if (categoryFound) {
			return res.status(200).json({
				success: true,
				message: `category with id ${categoryId} successfully deleted`,
			});
		} else {
			return res.status(404).json({
				success: false,
				message: `Category with id ${categoryId} not found`,
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

export const getCategory = async (req: Request, res: Response) => {
	try {
		const { categoryId } = req.params;
		const retrievedCategory = await Category.findById({ _id: categoryId });
		if (retrievedCategory) {
			return res.status(200).json(retrievedCategory);
		} else {
			return res.status(404).json({
				success: false,
				message: `Category with id ${categoryId} not found`,
			});
		}
	} catch (error) {
		return res.status(500).json({ error: error, message: 'Internal Server Error' });
	}
};

export const updateCategory = async (req: Request, res: Response) => {
	try {
		const { categoryId } = req.params;
		const { name, icon, color } = req.body;
		let updateCategory = await Category.findByIdAndUpdate(
			categoryId,
			{
				name,
				icon,
				color,
			},
			{ new: true }
		);
		if (updateCategory) {
			return res.status(201).json(updateCategory);
		} else {
			return res.status(404).json({
				success: false,
				message: `Category with id ${categoryId} not found`,
			});
		}
	} catch (error) {
		return res.status(500).json({ error: error, message: 'Internal Server Error' });
	}
};
