
import Feedback from '../models/Feedback.js'

const feedbackPipeline =(feedbackId, userId)=>{

 return Feedback.aggregate([
   {
     $match : {
          _id : feedbackId
     }
  },
  {
    $project: {
      _id: 1,
      author: 1,
      title: 1,
      details: 1,
      category: 1,
      status: 1,
      voteScore: 1,
      commentsCount: 1,
      comments: 1,
      liked: {
        $cond: {
          if: {
            $ne: [{$indexOfArray:["$upVotes", userId]}, -1],
          },
          then: 1,
          else: 0,
        },
      },
    },
  },
 ]).pipeline()

}

const approvedFeedbacksPipeline = (id)=>{
  return Feedback.aggregate([
    {
      $match:{
        status : {$ne: 'suggestion'}
      },
    },
   {
    $project: {
      _id: 1,
      author: 1,
      title: 1,
      details: 1,
      category: 1,
      status: 1,
      voteScore: 1,
      commentsCount: 1,
      liked: {
        $cond: {
          if: {
            $ne: [{$indexOfArray:["$upVotes", id]}, -1],
          },
          then: 1,
          else: 0,
        },
      },
    },
  },
  {
      $facet:{
      'live': [{$match : {status : 'live'}}],
      'planned': [{$match : {status : 'planned'}}],
      'inProgress': [{$match : {status : 'inprogress'}}],
    } 
  }]).pipeline()
}


export {feedbackPipeline, approvedFeedbacksPipeline  }