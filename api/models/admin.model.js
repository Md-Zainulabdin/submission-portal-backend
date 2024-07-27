import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
    {
        name: { type: String, required: true, trim: true, },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: { type: String, required: true },
        role: { type: String, default: "admin" },
    },
    {
        timestamps: true
    }
);

export const Admin = mongoose.model('Admin', adminSchema);