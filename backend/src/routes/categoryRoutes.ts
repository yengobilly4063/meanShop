import express from 'express';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from '../controllers/categoryControllers';
import { userProtected } from '../middlewares/userAuthProtect';

const router = express.Router();

router.route('/').get(getAllCategories).post(userProtected, createCategory);
router.route('/:categoryId').delete(userProtected, deleteCategory).get(getCategory).put(userProtected, updateCategory);

export default router;
