
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

const middleware = function(next){
  console.log('in')
  this.populate('author', 'username firstName lastName -_id').populate('comments');
  next()
}




commentSchema.pre('findOneAndUpdate', middleware)

commentSchema.pre('findOne',middleware)

commentSchema.pre('find',middleware)



const Comment =  mongoose.model('Comment', commentSchema);

export default Comment