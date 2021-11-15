import ErrorResponse from '../utils/errorResponse.js'

 
const errorHandler =(err, req, res, next)=>{
      let error={...err,message:err.message}
      console.log(error.code)
      if(err.code === 11000){
        const message = 'Duplicate Field Value'
        error = new ErrorResponse(message, 400)
      }
      if(err.name === 'ValidationError'){
         const message = Object.values(err.errors).map((e)=>e.message).join(',')
         error = new ErrorResponse(message,400)
      }
      if(err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError'){
        error = new ErrorResponse(err.message,401)
      }
      if(err.name === 'CastError'){
        error = new ErrorResponse('User Not Found',404)
      }
      if(error.message === 'Not allowed by CORS'){
        console.log(error)
      }

      res.status(error.statusCode || 500).json({success:false, error:error.message || "Server Error"})
}

export {errorHandler}