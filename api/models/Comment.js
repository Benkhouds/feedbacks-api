
import mongoose from 'mongoose'


const commentSchema = new mongoose.Schema({
    author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'User' 
    },
   content:{
     type:String,
     required:true,
     maxLength:200
   },
   comments:[{type:mongoose.Schema.Types.ObjectId, ref:'Comment'}]

},{timestamps:true})


commentSchema.pre('find',function(next){
  this.populate('author', 'username firstName lastName -_id') 
      .populate('comments')
  next()
})
const Comment =  mongoose.model('Comment', commentSchema);

export default Comment