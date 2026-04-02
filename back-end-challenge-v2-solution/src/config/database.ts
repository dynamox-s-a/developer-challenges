import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || "dynamox";

export async function connectDB(): Promise<typeof mongoose> {
  return mongoose.connect(`${MONGODB_URI}/${MONGODB_DATABASE}`);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}

export async function getStatusDB(): Promise<"connected" | "disconnected"> {
  const status =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  return status;
}
