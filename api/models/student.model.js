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
        role: { type: String, required: true },
        cnic: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        dateOfBirth: { type: Date, required: true },
        address: { type: String, required: true },
        fatherName: { type: String, required: true },
        fatherCnic: { type: String, required: true },
        campus: { type: String, required: true },
        course: { type: String, required: true },
        classPreference: { type: String, required: true },
        picture: { type: String, required: true },
        teacher: { type: Schema.Types.ObjectId, ref: 'Teacher' },
        hasLaptop: { type: Boolean, required: true }
    },
    {
        timestamps: true
    }
);

export const Student = mongoose.model('Student', studentSchema);