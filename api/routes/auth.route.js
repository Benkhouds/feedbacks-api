import AuthController from '../controllers/auth.controller.js';
import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
const router = Router();

router.route('/register').post(AuthController.register);
router.route('/login').post(AuthController.login);
router.route('/forgot-password').post(AuthController.forgotPassword);
router.route('/reset-password/:resetToken').put(AuthController.resetPassword);
router.route('/logout').post(authenticate(), AuthController.logout);
router.route('/refresh-token').post(AuthController.getRefreshToken);

export default router;
