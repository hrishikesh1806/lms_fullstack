import mongoose from "mongoose";

const connectDB = async () => {
  const uri = (process.env.MONGODB_URI || process.env.MONGO_URI) + "/lms";
  console.log("MongoDB URI:", uri); // 👈 Check what’s actually being loaded

  if (!uri) {
    throw new Error("❌ MONGODB_URI or MONGO_URI is not defined in environment variables");
  }

  mongoose.connection.on("connected", () => console.log("✅ Database Connected"));
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  });
};

export default connectDB;
