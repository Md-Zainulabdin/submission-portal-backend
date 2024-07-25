import mongoose, { Schema } from 'mongoose';

const courseSchema = new Schema(
  {
    coursename: { type: String, required: true },
    city: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

export const Course = mongoose.model('Course', courseSchema);
