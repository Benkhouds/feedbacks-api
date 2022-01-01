import User from '../models/User.js';
import ErrorResponse from '../utils/errorResponse.js';
export default class AdminController {
  static async stageSuggestion(req, res, next) {
    const { feedbackId, status } = req.body;

    try {
      const feedback = findByIdAndUpdate(
        feedbackId,
        { status },
        {
          new: true,
          runValidators: true
        }
      );

      if (!feedback) {
        return next(new ErrorResponse('Feedback Not Found', 404));
      }
      res.status(200).json({ success: true });
    } catch (error) {
      next(error);
    }
  }
  //revoking the refresh token (if account is hacked)

  static async revokeRefreshToken(req, res, next) {
    try {
      const id = req.user.id;
      await User.findByIdAndUpdate(
        id,
        { $inc: { tokenVersion: 1 } },
        { new: true }
      );

      res.status(200).send({ success: true });
    } catch (err) {
      next(err);
    }
  }

  //TODO: create admin dashboard and finish the operations
  static async updateUser(req, res, next) {
    res.status(200).json({ success: true });
  }
  static async deleteUser(req, res, next) {
    res.status(200).json({ success: true });
  }
}
