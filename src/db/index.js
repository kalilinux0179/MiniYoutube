import mongoose from "mongoose";
import { DB_NAME } from "../constatnts.js";
const connectDB = async () => {
    try {
        const connectionIstance = await mongoose.connect(
            `${process.env.MONGO_DB_URL}/${DB_NAME}`,
        );
        console.log(`DB connected: ${connectionIstance.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

export default connectDB;
