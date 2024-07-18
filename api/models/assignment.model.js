import mongoose, { Schema } from 'mongoose';

const assignmentSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    deadline: { type: String, required: true },
    link: { type: String, required: true },
    points: { type: Number, required: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'Teacher', required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    submissions: [{ type: Schema.Types.ObjectId, ref: 'Submission' }]
  },
  {
    timestamps: true
  }
);

export const Assignment = mongoose.model('Assignment', assignmentSchema);