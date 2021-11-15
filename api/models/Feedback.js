import mongoose from "mongoose" 


const feedbackSchema = new mongoose.Schema({

 author : {
   type: mongoose.Schema.Types.ObjectId ,
   ref: 'User',
   required : [true, 'provide the owner']
 },
  title : {
     type:String,
     unique:true,
     required: [true, 'Please provide a title']
  } ,

  details : {
     type:String,
     require:[true , 'please provide your feedback details']
  },
  category:{
     type:String,
     enum: ['ui', 'ux', 'enhancement', 'bug', 'feature'],
     required: [true, 'Please choose  a category'],
  },
  status:{
   type:String,
   enum :['planned', 'inprogress', 'live'],
   required: [true, 'Please provide an email '],
  },
  upVotes:[{type:mongoose.Schema.Types.ObjectId, ref :'User'}],
  voteScore:{
    type :Number,
    default:0,
  },
  comments : [{
    type:mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]

}, 
{timestamps : true});




feedbackSchema.pre('findOne', function(next){
    this
      .populate('author', 'username -_id')
      .populate({ 
        path: 'comments',
        populate: {
          path: 'comments'
        } ,
      });
    next()
})

feedbackSchema.pre('find', function(next){
  this.populate('author', 'username -_id');
  next()
})

feedbackSchema.virtual('commentsCount')
           .get(function(){
               return this.comments.length
           })



const Feedback = mongoose.model('Feedback', feedbackSchema)

export default Feedback