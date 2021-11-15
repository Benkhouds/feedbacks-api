
import ErrorResponse from "../utils/errorResponse.js";


export default class AuthController {


  static async getUserProfile(req, res, next) {
      
      if(req.user){
          res.status(200).send({success:true , user:req.user})
      }else{
          return next(new ErrorResponse("Invalid Credentials", 401));
      }

  }

}
