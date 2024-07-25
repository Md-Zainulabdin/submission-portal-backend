import mongoose, { Schema } from 'mongoose';

const batchSchema = new Schema(
    {
        batchname: { type: String, required: true },
        batchcode: { type: String, required: true, unique: true },
        course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
        time: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

export const Batch = mongoose.model('Batch', batchSchema);
