import Feedback from './api/models/Feedback.js'
import mongoose from 'mongoose'
function test(){
 try {
     Feedback.aggregate([
     {
         '$unwind': {
             'path': '$upVotes', 
             'preserveNullAndEmptyArrays': true
         }
     }, {
         '$project': {
             '_id': 1, 
             'author': 1, 
             'title': 1, 
             'details': 1, 
             'category': 1, 
             'status': 1, 
             'voteScore': 1, 
             'commentsCount': 1, 
             'upVotes': 1, 
             'liked': {
                 '$cond': {
                     'if': {
                         '$eq': [
                             '$upVotes', '6191866fd57525fe48f066c7'
                         ]
                     }, 
                     'then': 1, 
                     'else': 0
                 }
             }
         }
     }
 ]).exec((error, feedbacks)=>{
    if(error){
     console.log(error)
    }
   console.log(feedbacks)

 })
 } catch (err) {
    console.log(err)
 }     

}

test()