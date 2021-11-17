const checkIdEquality = (arr, id) => arr.some((a)=>a.equals(id))

const feedbacksWithLikeStatus = (feedbacks, id)=>{
 return feedbacks.map((feedback)=>{
  if(id && checkIdEquality(feedback.upVotes, id)){
    return {...feedback,  liked:true}
  }
  return {...feedback, liked:false}
 })

}

export default feedbacksWithLikeStatus ;