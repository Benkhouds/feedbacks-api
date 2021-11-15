import {Router} from 'express'
import { authenticateUser } from '../middleware/auth.js'
import FeedbackController from '../controllers/feedback.controller.js'
const router = Router()

router.route('/').get(FeedbackController.getAllFeedbacks)
                 .post(authenticateUser, FeedbackController.addFeedback)
                 
router.use(authenticateUser)   
//all these routes require authentication 

router.route('/:id').get(FeedbackController.getFeedback)
                    .put(FeedbackController.editFeedback)                    
//likes
router.route('/:id/vote').patch(FeedbackController.addUserVote)
                  
//add comment                    
router.route('/:id/comments').post(FeedbackController.addComment)
//replies
router.route('/:postId/comments/:commentId/replies').post(FeedbackController.replyToComment)




export default router