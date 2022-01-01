import ErrorResponse from '../utils/errorResponse.js';
import Report from '../models/Report.js';

export default class AuthController {
  static async getUserProfile(req, res, next) {
    if (req.user) {
      res.status(200).send({ success: true, user: req.user });
    } else {
      return next(new ErrorResponse('Invalid Credentials', 401));
    }
  }

  static async postReport(req, res, next) {
    const { category, description } = req.body;
    const user = req.user.id;
    try {
      await Report.create({
        user,
        category,
        description
      });
      res.status(201).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
}
