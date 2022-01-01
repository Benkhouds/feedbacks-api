import mongoose from 'mongoose';

const ReportSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    category: {
      type: String,
      enum: ['hacked', 'bug'],
      default: 'hacked'
    },
    description: {
      type: String,
      required: [true, 'Please provide a description']
    }
  },
  { timestamps: true }
);

export default mongoose.model('Report', ReportSchema);
