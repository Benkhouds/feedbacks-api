import {Router} from 'express'
import { authenticateUser } from '../middleware/auth.js'
import UserController from '../controllers/user.controller.js'
const router = Router()

router.get('/profile',authenticateUser, UserController.getUserProfile )



export default router