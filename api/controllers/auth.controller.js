import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import SendMail from "../utils/sendEmail.js";
import crypto from "crypto";
import {sendAccessToken , sendRefreshToken} from '../utils/sendTokens.js';
import jwt from "jsonwebtoken";

export default class AuthController {

  

  static  async getRefreshToken(req,res, next)
  {
    const token = req.cookies.jid;
    if (!token) {
      return next(new ErrorResponse('Error authenticating', 401))
    }

    let payload = null;
    try {
      payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      console.log(err);
      return next(new ErrorResponse('Error authenticating', 401))
    }

    const user = await User.findById(payload.id)

    if (!user) {
      return next(new ErrorResponse('Error authenticating', 401))
    }

    sendRefreshToken(res, user.createRefreshToken());

    sendAccessToken(res, user)
  }

  static async register(req, res, next) {
    const { firstName, lastName, username, email, password } = req.body;
    //joi validation
    try {
      const user = await User.create({
        firstName,
        lastName,
        username,
        email,
        password,
      });
      console.log(user);
      sendRefreshToken(res, user.createRefreshToken());
      sendAccessToken(res,user);
      //created successfully
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(
        new ErrorResponse("Please provide an email and a password", 400)
      );
      //bad request
    }
    try {
      const user = await User.findOne({ email }).select("+password");
      console.log(user)
      if (!user) {
        const error = new ErrorResponse("Invalid Credentials", 401);
        return next(error);
      }
      const AreMatched = await user.matchPassword(password);
      if (AreMatched) {
        sendRefreshToken(res, user.createRefreshToken());
        sendAccessToken(res,user);
      } else {
        return next(new ErrorResponse("Invalid Credentials", 401));
      }
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req, res, next) {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return next(new ErrorResponse("Email could not be sent", 404));
      }
      const resetToken = user.getResetPasswordToken();
      await user.save();
      const resetUrl = `${process.env.DOMAIN_NAME}/auth/resetpassword/${resetToken}`;
      try {
        await SendMail.sendResetPasswordEmail(user.email, resetUrl, next);
        res.status(200).json({ success: true, message: "Email Sent" });
      } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        return next(new ErrorResponse("Email Could Not Be Sent", 500));
      }
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req, res, next) {
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");
    try {
      const user = await User.findOne({
        resetPasswordToken: resetToken,
        resetPasswordExpires: { $gt: Date.now() },
      });
      if (!user) {
        return next(new ErrorResponse("Invalid Reset Token", 400));
      }

      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
      res
        .status(200)
        .json({ success: true, message: "Password modified successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req, res, next){
    try{
      res.cookie("jid", '', {
        httpOnly: true,
        path:'/api/v1/auth/refresh-token'
      });
      
      res.status(200).json({success:true});
    }catch(err){
      next(err)
    }
  }
}