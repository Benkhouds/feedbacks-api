import mongoose from 'mongoose';
import ErrorResponse from '../utils/errorResponse.js';
import Feedback from '../models/Feedback.js';
import Comment from '../models/Comment.js';
import {
   allFeedbacksPipeline,
   feedbackPipeline,
   approvedFeedbacksPipeline,
} from '../utils/pipelines.js';

import { formatSort } from '../helpers/formatQueries.js';

export default class FeedbackController {
   static async getAllFeedbacks(req, res, next) {
      const sortBy = formatSort(req.query.sort);
      const category = req.query.category;

      try {
         let feedbacks = await Feedback.aggregate(
            allFeedbacksPipeline(req.user?.id || null, category, sortBy)
         ).exec();

         res.status(200).json({
            success: true,
            feedbacks,
            total_results: feedbacks.length,
         });
      } catch (err) {
         next(err);
      }
   }

   static async getApprovedFeedbacks(req, res, next) {
      try {
         let id = req.user?._id ? mongoose.Types.ObjectId(req.user._id) : '';

         const [data] = await Feedback.aggregate(
            approvedFeedbacksPipeline(id)
         ).exec();

         res.status(200).json({
            success: true,
            feedbacks: {
               live: data.live,
               planned: data.planned,
               inProgress: data.inProgress,
            },
         });
      } catch (err) {
         next(err);
      }
   }

   static async addFeedback(req, res, next) {
      try {
         const { title, details, category } = req.body;
         await Feedback.create({
            author: req.user._id,
            title,
            details,
            category,
         });
         res.status(201).json({ success: true });
      } catch (err) {
         next(err);
      }
   }

   static async editFeedback(req, res, next) {
      try {
         const id = req.params.id;
         const { title, details, category, status } = req.body;
         const feedback = await Feedback.findByIdAndUpdate(
            id,
            { author: req.user._id, title, details, category, status },
            {
               new: true,
               runValidators: true,
            }
         );
         console.log(feedback);
         res.status(200).json({ success: true, feedback });
      } catch (err) {
         next(err);
      }
   }
   static async deleteFeedback(req, res, next) {
      const id = req.params.id;
      try {
         await Feedback.findByIdAndDelete(id);
         res.status(200).json({ success: true });
      } catch (err) {
         next(err);
      }
   }
   static async getFeedback(req, res, next) {
      try {
         const feedbackId = req.params.id
            ? mongoose.Types.ObjectId(req.params.id)
            : '';
         const userId = mongoose.Types.ObjectId(req.user._id);
         const aggregate = await Feedback.aggregate(
            feedbackPipeline(feedbackId, userId)
         );
         const [feedback] = await Feedback.populate(aggregate, {
            path: 'comments',
         });
         res.status(200).json({
            success: true,
            feedback: { ...feedback, author: feedback.author[0] },
         });
      } catch (err) {
         next(err);
      }
   }

   static async addUserVote(req, res, next) {
      try {
         const id = req.params.id;
         console.log(req.params);
         console.log(id);
         const post = await Feedback.findById(id);
         if (post) {
            let liked = false;
            const userIndex = post.upVotes.indexOf(req.user._id);
            if (userIndex !== -1) {
               post.upVotes.splice(userIndex, 1);
               post.voteScore -= 1;
            } else {
               post.upVotes.push(req.user._id);
               liked = true;
               post.voteScore += 1;
            }
            await post.save();
            res.status(200).json({
               success: true,
               voteScore: post.voteScore,
               liked,
            });
         } else {
            return next(new ErrorResponse('Post not found', 404));
         }
      } catch (err) {
         next(err);
      }
   }

   static async addComment(req, res, next) {
      try {
         const id = req.params.id;
         const { content } = req.body;
         let comment = await Comment.create({ content, author: req.user._id });
         const feedback = await Feedback.findByIdAndUpdate(
            id,
            {
               $push: { comments: { $each: [comment._id], $position: 0 } },
               $inc: { commentsCount: 1 },
            },
            { new: true, runValidators: true }
         );

         res.status(201).json({
            success: true,
            comment,
            commentsCount: feedback.commentsCount,
         });
      } catch (err) {
         next(err);
      }
   }
   static async replyToComment(req, res, next) {
      try {
         const { postId, commentId } = req.params;
         const { content } = req.body;
         console.log(content);
         const post = await Feedback.findOneAndUpdate(
            { _id: postId },
            {
               $inc: { commentsCount: 1 },
            },
            { new: true }
         );

         if (post) {
            const reply = await Comment.create({
               content,
               author: req.user._id,
            });
            const newComment = await Comment.findByIdAndUpdate(
               commentId,
               {
                  $push: {
                     comments: { $each: [reply._id], $position: 0 },
                  },
               },
               { new: true }
            );
            console.log(newComment);
            res.status(201).json({
               success: true,
               comment: newComment,
               commentsCount: post.commentsCount,
            });
         } else {
            return next(new ErrorResponse('Feedback not found', 404));
         }
      } catch (err) {
         next(err);
      }
   }
}
