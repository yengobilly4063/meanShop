import express from 'express';
import { createUser, deleteUser, getAllUsers, getSingleUser, getUserCount, updateUser } from '../controllers/userControllers';
import {authUser} from "../controllers/authController"
import { userProtected } from '../middlewares/userAuthProtect';
import { isAdmin } from '../middlewares/userIsAdmin';
const router = express.Router();

router.route('/').get(userProtected, getAllUsers);
router.route('/get/count').get(userProtected, isAdmin, getUserCount);
router.route('/register').post(createUser);
router.route('/login').post(authUser);
router.route('/:userId').get(userProtected, getSingleUser).put(userProtected, updateUser).delete(userProtected, isAdmin, deleteUser);


export default router;
