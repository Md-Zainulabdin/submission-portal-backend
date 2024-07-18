import { connect } from 'mongoose';

const connectDB = async () => {
    try {
        const connectionInstance = await connect(process.env.DATABASE_URI);
        console.log(`Connected to MongoDB`);
    } catch (error) {
        console.error(`MongoDB connection error:`, error);
        process.exit(1);
    }
};

export default connectDB;
