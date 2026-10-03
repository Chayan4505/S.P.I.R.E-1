import mongoose from "mongoose";

const connectDatabase = async () => {
    try {
        const mongoURI = process.env.MONGO_URI_ATLAS;

        if (!mongoURI) {
            throw new Error("MongoDB URI not found");
        }

        await mongoose.connect(mongoURI);

        console.log("MongoDB Connected Successfully");
        console.log(`Database : ${mongoose.connection.name}`);
        console.log(`Host : ${mongoose.connection.host}`);

    } catch (error) {
        console.error("MongoDB Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
};

export default connectDatabase;