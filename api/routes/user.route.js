import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import UserController from '../controllers/user.controller.js';

const router = Router();

router.get('/profile', authenticate(), UserController.getUserProfile);
router.post('/report-hacked', authenticate(), UserController.postReport);
export default router;
