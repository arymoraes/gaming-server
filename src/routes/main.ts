/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from 'express';
import authMiddleware from '../middleware/auth';
import AuthController from '../controllers/user/AuthController';

const UserAuthController = new AuthController();

const router = express.Router();

router.get('/', () => console.log('fuck'));

// Login and Signup
router.post('/user/register', UserAuthController.register);
router.post('/user/login', UserAuthController.login);
router.get('/user/me', authMiddleware, UserAuthController.me);
// router.post('/forgotPassword', ProviderControllers.forgotPassword);
// router.post('/resetPassword', ProviderControllers.resetPassword);
// router.get('/verify/:token', ProviderControllers.verify);

export default router;
