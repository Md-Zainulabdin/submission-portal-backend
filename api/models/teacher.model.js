import mongoose, { Schema } from 'mongoose';

const teacherSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    cnic: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "teacher" },
    batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
  },
  {
    timestamps: true
  }
);

export const Teacher = mongoose.model('Teacher', teacherSchema);
