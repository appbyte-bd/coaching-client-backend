import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const URL = process.env.databaseURL;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URL, {
      replicaSet: 'rs0',
      authSource: 'admin',
      directConnection: true,
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;