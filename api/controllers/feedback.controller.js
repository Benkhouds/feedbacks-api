import ErrorResponse from "../utils/errorResponse.js";
import Feedback from "../models/Feedback.js";
import Comment from "../models/Comment.js";

export default class FeedbackController {
  
  static async getAllFeedbacks(req, res, next) {
 
     const  sortBy = req.query.sort ? req.query.sort :'-createdAt'
     const category = req.query.category ? { category : req.query.category} :{} ;
     try {
      let feedbacks = await Feedback.find({status:'suggestion' ,...category}).sort(sortBy).lean();
      
      
      const checkEquality = (arr) => arr.some((a)=>a.equals(req.user?._id ||''))
      feedbacks =feedbacks.map((feedback)=>{

        if(req.user && checkEquality(feedback.upVotes)){
          return {...feedback,  liked:true}
        }
        return {...feedback, liked:false}
      })
      
  
      console.log(feedbacks)
      res.status(200).json({ success: true, feedbacks, total_results:feedbacks.length });
    } catch (err) {
      next(err);
    }
  }
  
  static async getApprovedFeedbacks(req, res, next){

    try {
      let feedbacks = await Feedback.find({status: { $ne:'suggestion'} }).sort('-createdAt').lean();
      res.status(200).json({ success: true, feedbacks , total_results:feedbacks.length });
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
      res.status(200).json({ success: true , feedback});
    } catch (err) {
      next(err);
    }
  }
  static async deleteFeedback(req, res, next){
    const id = req.params.id;
   try {
      await Feedback.findByIdAndDelete(id);
      res.status(200).json({success:true});
     
   } catch (err) {
       next(err)
   }

  }
  static async getFeedback(req, res, next) {
    try {
      const id = req.params.id;
      const feedback = await Feedback.findById(id).lean();
      res.status(200).json({ success: true, feedback });
    } catch (err) {
      next(err);
    }
  }

  static async addUserVote(req, res, next) {
    try {
      const id = req.params.id;
      console.log(req.params)
      console.log(id)
      const post = await Feedback.findById(id);
      if(post){
        let liked =false; 
        const userIndex = post.upVotes.indexOf(req.user._id)
         if(userIndex !== -1){
            post.upVotes.splice(userIndex,1)
            post.voteScore-= 1;
          }else{
             post.upVotes.push(req.user._id);
             liked = true; 
             post.voteScore+= 1;
          }
          await post.save()
         res.status(200).json({ success: true, voteScore: post.voteScore, liked})
      }else{
         return next(new ErrorResponse('Post not found', 404))
      }
    } catch (err) {
      next(err);
    }
  }

  static async addComment(req, res, next) {
      try {
        const id = req.params.id;
        const { content } = req.body;
        const comment = await Comment.create({ content, author: req.user._id });
        const feedback = await Feedback.findByIdAndUpdate(
          id,
          {
            $push: { comments: {$each: [comment._id] , $position: 0 } },
            $inc : {commentsCount : 1}
          },
          { new: true }
        );
        console.log(feedback);

        res.status(201).json({success:true, comment})

      } catch (err) {
        next(err);
      }
  }
  static async replyToComment(req, res, next) {
    try {
       const {postId , commentId} = req.params ;
       const {content} = req.body
       const post  = await Feedback.findById(postId);
       if(post){
          const reply = await Comment.create({content, author:req.user._id})
          const newComment = await Comment.findByIdAndUpdate(commentId, {
              $push:{
                comments:{$each: [reply._id] , $position : 0}
              },        
              $inc:{commentsCount : 1 }
          },{new :true});

          res.status(201).json({success:true, comment : newComment})
       }else{
         return next(new ErrorResponse('Feedback not found', 404));
       }

    } catch (err) {
      next(err);
    }
  }


}
