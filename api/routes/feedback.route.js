import {Router} from 'express'
import { authenticateUser } from '../middleware/auth.js'
import FeedbackController from '../controllers/feedback.controller.js'
const router = Router()

router.route('/').get(FeedbackController.getAllFeedbacks)
                 .post(authenticateUser, FeedbackController.addFeedback)
router.get('/approved', FeedbackController.getApprovedFeedbacks);                 
router.use(authenticateUser)   
//all these routes require authentication 
//authenticated user should get which post he has liked
router.get('/protected/all', FeedbackController.getAllFeedbacks)
router.route('/:id').get(FeedbackController.getFeedback)
                    .put(FeedbackController.editFeedback) 
                    .delete(FeedbackController.deleteFeedback)                   
//likes
router.route('/:id/vote').patch(FeedbackController.addUserVote)
                  
//add comment                    
router.route('/:id/comments').post(FeedbackController.addComment)
//replies
router.route('/:postId/comments/:commentId/replies').post(FeedbackController.replyToComment)




export default router