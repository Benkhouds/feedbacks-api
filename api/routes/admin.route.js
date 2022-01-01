import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
const router = Router();

//admin specific routes

router.post('/admin/approve-suggestion', authenticate('admin'));
/* router.route('/admin/:userId').all(authenticate('admin')).post().delete(); */
