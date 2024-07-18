import mongoose, { Schema } from 'mongoose';

const submissionSchema = new Schema(
    {
      url: { type: String, required: true },
      student: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
      assignment: { type: Schema.Types.ObjectId, ref: 'Assignment', required: true },
      isSeen: { type: Boolean, default: false },
      status: { type: String, enum: ['pending', 'approved', 'disapproved'], default: 'pending' },
      feedback: { type: String },
      rejectionReason: { type: String },
      isApproved: { type: Boolean, default: false },
      canResubmit: { type: Boolean, default: false },
      points: { type: Number, min: 0, max: 100 }, 
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    },
    {
      timestamps: true 
    }
  );
  
  export const Submission = mongoose.model('Submission', submissionSchema);