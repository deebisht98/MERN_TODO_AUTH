import mongoose from "mongoose";
import env from "../env.js";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2, // Minimum number of connections in the pool
      maxIdleTimeMS: 60000, // Close connections after 60 seconds of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    mongoose.connection.on("connected", () => {
      console.log("MongoDB pool connected");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB pool connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("MongoDB pool disconnected");
    });

    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
      } catch (err) {
        console.error("Error during MongoDB connection closure:", err);
        process.exit(1);
      }
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
