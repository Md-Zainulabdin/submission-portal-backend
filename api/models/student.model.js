import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
    {
        fullname: { type: String, required: true, trim: true, },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        gender: { type: String, required: true },
        password: { type: String, required: true },
        role: { type: String, default: "student" },
        cnic: { type: String, required: true, unique: true },
        city: { type: String, required: true },
        batch: { type: Schema.Types.ObjectId, ref: 'Batch', required: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
        hasLaptop: { type: Boolean, required: true }
    },
    {
        timestamps: true
    }
);

export const Student = mongoose.model('Student', studentSchema);