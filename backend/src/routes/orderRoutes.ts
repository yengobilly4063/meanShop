import express from 'express';
import {
	createOrder,
	deleteOrder,
	getAllOrders,
	getOrderCount,
	getSingleOrder,
	getTotalSales,
	getUserOrders,
	updateOrder,
} from '../controllers/orderControllers';
import { userProtected } from '../middlewares/userAuthProtect';
import { isAdmin } from '../middlewares/userIsAdmin';
const router = express.Router();

router.route('/').get(userProtected, isAdmin, getAllOrders).post(userProtected, createOrder);
router.route('/get/totalsales').get(userProtected, isAdmin, getTotalSales);
router.route('/get/count').get(userProtected, isAdmin, getOrderCount);
router
	.route('/:orderId')
	.get(userProtected, getSingleOrder)
	.put(userProtected, isAdmin, updateOrder)
	.delete(userProtected, isAdmin, deleteOrder);

router.route('/get/userorders/:userId').get(userProtected, getUserOrders);

export default router;
