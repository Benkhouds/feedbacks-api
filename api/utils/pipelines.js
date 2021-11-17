import mongoose from 'mongoose'; 
import Feedback from '../models/Feedback.js'

const feedbacksPipeline =(id='')=>{
  if(id) {
    id = mongoose.Types.ObjectId(id)
  }
  console.log(id)
 return Feedback.aggregate([{
 '$unwind': {
   path: "$upVotes",
   preserveNullAndEmptyArrays: true,
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
   upVotes: 1,
   liked: {
     $cond: {
       if: {
         $eq: ["$upVotes", id],
       },
       then: 1,
       else: 0,
     },
   },
 },
}]).pipeline()


}

export {feedbacksPipeline}