import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/ErrorResponse.js';
import User from '../models/User.js';

async function authenticateUser(req, res, next){ 
   let token;
   
   if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
   }
   if(!token){
       return next(new ErrorResponse('Not Authorized', 401))
   }
   try {
      const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
      const user = await User.findById(payload.id)
      if(!user){
         return next(new ErrorResponse('User Not Found', 404))
      }
      req.user = user ;
      next()
   } catch (error) { 
      console.log(error)
      next(error)
   }

}

export {authenticateUser}