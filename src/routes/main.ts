import express from 'express';

const router = express.Router();

router.get('/', () => console.log('fuck'));

// Login and Signup
// router.post('/signup', ProviderControllers.register);
// router.post('/login', ProviderControllers.login);
// router.get('/me', authMiddleware, ProviderControllers.profile);
// router.post('/forgotPassword', ProviderControllers.forgotPassword);
// router.post('/resetPassword', ProviderControllers.resetPassword);
// router.get('/verify/:token', ProviderControllers.verify);

export default router;
