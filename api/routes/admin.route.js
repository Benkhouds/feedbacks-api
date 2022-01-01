import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import AdminController from '../controllers/admin.controller.js';
const router = Router();

//admin specific routes

router.post(
  '/admin/approve-suggestion',
  authenticate('admin'),
  AdminController.stageSuggestion
);
router
  .route('/admin/:userId')
  .all(authenticate('admin'))
  .put(AdminController.updateUser)
  .delete(AdminController.deleteUser);
router
  .route('/revoke-token')
  .post(authenticate('admin'), AdminController.revokeRefreshToken);
