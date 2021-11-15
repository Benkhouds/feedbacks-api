import AuthController from "../controllers/auth.controller.js";
import {Router} from 'express'
import {authenticateUser}  from '../middleware/auth.js';
const router = Router()

router.route('/register').post(AuthController.register)
router.route('/login').post(AuthController.login)
router.route('/forgot-password').post(AuthController.forgotPassword)
router.route('/reset-password/:resetToken').put(AuthController.resetPassword)
router.route('/logout').post(authenticateUser, AuthController.logout)
router.route('/refresh-token').post(AuthController.getRefreshToken);
//TODO: adding moderator middleware 
router.route('/revoke-token').post(AuthController.revokeRefreshToken)
export default router