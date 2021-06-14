import { Request, Response } from 'express';
import { Order } from '../models/order';
import { OrderItem } from '../models/orderItem';
import { IOrderItem } from '../interfaces/IOrderItem';
import { User } from '../models/user';
import { Product } from '../models/product';
import { Category } from '../models/category';

export const getAllOrders = async (req: Request, res: Response) => {
	try {
		const retrievedOrders = await Order.find()
			.populate({
				path: 'orderItems',
				model: OrderItem,
				populate: { path: 'product', model: Product, populate: { path: 'category', model: Category } },
			})
			.populate({ path: 'user', model: User, select: ['name'] })
			.sort({ dateOrdered: -1 });
		if (!retrievedOrders) {
			return res.status(400).json({ success: false, message: 'Failed to retrieve Orders' });
		}
		return res.status(200).json(retrievedOrders);
	} catch (error) {
		return res.status(500).json({
			error: error,
			success: false,
			message: 'Failed to retrieve Orders',
		});
	}
};

export const getUserOrders = async (req: Request, res: Response) => {
	try {
		const { userId } = req.params;
		const userOrderList = await Order.find({ user: userId })
			.populate({
				path: 'orderItems',
				model: OrderItem,
				populate: { path: 'product', model: Product, populate: { path: 'category', model: Category } },
			})
			.sort({ dateOrdered: -1 });
		if (!userOrderList) {
			return res.status(400).json({ success: false, message: 'Failed to retrieve user orders' });
		}
		return res.status(200).json(userOrderList);
	} catch (error) {
		return res.status(500).json({
			error: error,
			success: false,
			message: 'Failed to retrieve user orders',
		});
	}
};

export const getSingleOrder = async (req: Request, res: Response) => {
	try {
		const { orderId } = req.params;
		console.log(orderId);
		const retrievedOrder = await Order.findById({ _id: orderId })
			.populate({
				path: 'orderItems',
				model: OrderItem,
				populate: {
					path: 'product',
					model: Product,
					populate: { path: 'category', model: Category },
				},
			})
			.populate({ path: 'user', model: User, select: ['name'] });
		if (!retrievedOrder) {
			return res.status(400).json({ success: false, message: 'Failed to retrieve Order' });
		}
		return res.status(200).json(retrievedOrder);
	} catch (error) {
		return res.status(500).json({
			error: error,
			success: false,
			message: 'Failed to retrieve Order',
		});
	}
};

export const createOrder = async (req: Request, res: Response) => {
	try {
		const {
			orderItems,
			shippingAddress1,
			shippingAddress2,
			city,
			zip,
			country,
			phone,
			status,
			totalPrice,
			user,
			dateOrdered,
		} = req.body;

		const orderItemIds: string[] = await await Promise.all(
			orderItems.map(async (orderItem: IOrderItem) => {
				let newOrderItem = new OrderItem({
					quantity: orderItem.quantity,
					product: orderItem.product,
				});
				newOrderItem = await newOrderItem.save();
				return newOrderItem._id;
			})
		);

		const unresolvedTotalPrice: number[] = await Promise.all(
			orderItemIds.map(async (orderItemId) => {
				const orderItem: IOrderItem = await OrderItem.findById({ _id: orderItemId }).populate({
					path: 'product',
					model: Product,
					select: ['price'],
				});
				const totalPrice = orderItem.product.price * orderItem.quantity;
				return totalPrice;
			})
		);

		const resolvedTotalPrice = unresolvedTotalPrice.reduce((total: number, current: number) => (total += current), 0);

		let newOrder = new Order({
			orderItems: orderItemIds,
			shippingAddress1,
			shippingAddress2,
			city,
			zip,
			country,
			phone,
			status,
			totalPrice: resolvedTotalPrice,
			user,
			dateOrdered,
		});
		newOrder = await newOrder.save();
		if (!newOrder) {
			return res.status(400).json({ success: false, message: 'Order could not be created' });
		}
		return res.json(newOrder);
	} catch (error) {
		return res.json({
			error: error,
			success: false,
			message: 'Failed to create Order',
		});
	}
};

export const updateOrder = async (req: Request, res: Response) => {
	try {
		const { status } = req.body;
		const { orderId } = req.params;

		const updatedOrder = await Order.findByIdAndUpdate({ _id: orderId }, { status }, { new: true })
			.populate({
				path: 'orderItems',
				model: OrderItem,
				populate: {
					path: 'product',
					model: Product,
					populate: { path: 'category', model: Category },
				},
			})
			.populate({ path: 'user', model: User, select: ['name'] });

		if (!updatedOrder) {
			return res.status(400).json({ success: false, message: 'Order could not be updated' });
		}
		return res.json(updatedOrder);
	} catch (error) {
		return res.json({
			error: error,
			success: false,
			message: 'Failed to update Order',
		});
	}
};

export const deleteOrder = async (req: Request, res: Response) => {
	try {
		const { orderId } = req.params;
		let orderToBeDeleted = await Order.findByIdAndRemove(orderId);
		if (orderToBeDeleted) {
			await Promise.all(
				orderToBeDeleted.orderItems.map(async (orderItemId: string) => {
					let deletedOrderItems = await OrderItem.findByIdAndDelete({ _id: orderItemId });
					return deletedOrderItems;
				})
			);
			return res.status(200).json({
				success: true,
				message: `Order successfully deleted`,
			});
		} else {
			return res.status(404).json({
				success: false,
				message: `Order not found`,
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

export const getTotalSales = async (req: Request, res: Response) => {
	try {
		const totalSales = await Order.aggregate([{ $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }]);
		if (!totalSales) {
			return res.status(400).json({ success: false, message: 'No sales found' });
		}
		return res.status(200).json({ totalSales: totalSales.pop().totalSales });
	} catch (error) {
		return res.status(400).json({
			error: error,
			success: false,
			message: 'Internal Server Error',
		});
	}
};

export const getOrderCount = async (req: Request, res: Response) => {
	try {
		const orderCount: number = await Order.find().countDocuments();
		if (!orderCount) {
			return res.status(400).json({ success: false, message: 'No orders found' });
		}
		return res.json({ orderCount: orderCount });
	} catch (error) {
		return res.json(500).json({ error: error, success: false, message: 'Internal Server Error' });
	}
};
