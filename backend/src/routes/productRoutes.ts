import express from 'express';
import {
	getAllProducts,
	createProducts,
	getProduct,
	updateProduct,
	deleteProduct,
	getProductCount,
	getFeaturedProducts,
	updateProductGalary,
} from '../controllers/productControllers';
import { uploadOptions } from '../middlewares/imageUpload';
import { userProtected } from '../middlewares/userAuthProtect';
import { isAdmin } from '../middlewares/userIsAdmin';

const router = express.Router();
// userProtected, isAdmin,
router.route('/').get(getAllProducts).post(uploadOptions.single('image'), createProducts);

router.route('/get/featured/:count?').get(getFeaturedProducts);

router
	.route('/:productId')
	.get(getProduct)
	.put(userProtected, isAdmin, uploadOptions.single('image'), updateProduct)
	.delete(userProtected, isAdmin, deleteProduct);
router
	.route('/galary/images/:productId')
	.put(userProtected, isAdmin, uploadOptions.array('images', 10), updateProductGalary);

router.route('/get/count').get(userProtected, isAdmin, getProductCount);

export default router;
