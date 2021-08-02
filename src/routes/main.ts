/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from 'express';
import authMiddleware from '../middleware/auth';
import AuthController from '../controllers/user/AuthController';
import adminAuthMiddleware from '../middleware/admin';
import AdminController from '../controllers/admin/AdminController';
import GameController from '../controllers/admin/GameController';
import CategoryController from '../controllers/admin/CategoryController';

const UserAuthController = new AuthController();
const AdminUserController = new AdminController();

const router = express.Router();

router.get('/', (req, res) => res.send(200).json({
  wenked: 'da uma mamada',
}));

// Login and Signup
router.post('/user/register', UserAuthController.register);
router.post('/user/login', UserAuthController.login);
router.get('/user/me', authMiddleware, UserAuthController.me);
// router.post('/forgotPassword', ProviderControllers.forgotPassword);
// router.post('/resetPassword', ProviderControllers.resetPassword);
// router.get('/verify/:token', ProviderControllers.verify);

// Admin Routes
router.post('/admin/user/register', authMiddleware, adminAuthMiddleware, AdminUserController.addUser);

router.post('/admin/game/add', authMiddleware, adminAuthMiddleware, GameController.addGame);

router.post('/admin/categories/add', authMiddleware, adminAuthMiddleware, CategoryController.addCategory);

export default router;
