import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "provide the owner"],
    },
    title: {
      type: String,
      unique: true,
      required: [true, "Please provide a title"],
    },

    details: {
      type: String,
      require: [true, "please provide your feedback details"],
    },
    category: {
      type: String,
      enum: ["ui", "ux", "enhancement", "bug", "feature"],
      required: [true, "Please choose  a category"],
    },
    status: {
      type: String,
      enum: ["suggestion", "planned", "inprogress", "live"],
      default: "suggestion",
      required: [true, "Please provide an email "],
    },
    upVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    voteScore: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);




const Feedback = mongoose.model("Feedback", feedbackSchema);

export default Feedback;
