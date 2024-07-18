import mongoose, { Schema } from 'mongoose';

const teacherSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    cnic: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    phone: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: true },
    batch: { type: String, required: true },
    course: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }], 
    picture: { type: String, required: true },
  },
  {
    timestamps: true
  }
);

export const Teacher = mongoose.model('Teacher', teacherSchema);
