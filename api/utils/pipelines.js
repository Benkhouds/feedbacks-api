import Feedback from '../models/Feedback.js';
import mongoose from 'mongoose';

const allFeedbacksPipeline = (userId, category, sortingObj) => {
   const match = {
      $match: {
         status: 'suggestion',
      },
   };
   if (category) {
      match.$match.category = category;
   }
   return reusablePipeline(userId, match, sortingObj);
};

const feedbackPipeline = (feedbackId, userId) => {
   const match = {
      $match: {
         _id: feedbackId,
      },
   };

   return reusablePipeline(userId, match);
};

const approvedFeedbacksPipeline = (id) => {
   const match = {
      $match: {
         status: { $ne: 'suggestion' },
      },
   };
   const facet = {
      $facet: {
         live: [
            { $match: { status: 'live' } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
         ],
         planned: [
            { $match: { status: 'planned' } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
         ],
         inProgress: [
            { $match: { status: 'inprogress' } },
            { $sort: { createdAt: -1 } },
            { $limit: 10 },
         ],
      },
   };
   return reusablePipeline(id, match, null, [facet]);
};

export { feedbackPipeline, approvedFeedbacksPipeline, allFeedbacksPipeline };

const reusablePipeline = (userId, match, sort, ops) => {
   const pipelineArray = [
      {
         $lookup: {
            from: 'users',
            localField: 'author',
            foreignField: '_id',
            as: 'author',
         },
      },
      {
         $project: {
            _id: 1,
            'author.username': 1,
            'author.lastName': 1,
            'author.firstName': 1,
            title: 1,
            details: 1,
            category: 1,
            status: 1,
            voteScore: 1,
            commentsCount: 1,
            comments: 1,
         },
      },
   ];

   let liked = null;
   if (userId) {
      liked = {
         $cond: {
            if: {
               $ne: [
                  {
                     $indexOfArray: [
                        '$upVotes',
                        mongoose.Types.ObjectId(userId),
                     ],
                  },
                  -1,
               ],
            },
            then: 1,
            else: 0,
         },
      };
   }
   if (userId) {
      pipelineArray[1].$project.liked = liked;
   }
   if (ops) {
      pipelineArray.push(...ops);
   }

   const res = sort ? [match, sort] : [match].concat(pipelineArray);

   return Feedback.aggregate(res).pipeline();
};
