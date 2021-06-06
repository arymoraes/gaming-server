/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import express from 'express';
import AuthController from '../controllers/user/AuthController';

const UserAuthController = new AuthController();

const router = express.Router();

router.get('/', () => console.log('fuck'));

// Login and Signup
router.post('/user/register', UserAuthController.register);
// router.post('/login', ProviderControllers.login);
// router.get('/me', authMiddleware, ProviderControllers.profile);
// router.post('/forgotPassword', ProviderControllers.forgotPassword);
// router.post('/resetPassword', ProviderControllers.resetPassword);
// router.get('/verify/:token', ProviderControllers.verify);

export default router;
