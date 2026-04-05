import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB(): Promise<typeof mongoose> {
  return mongoose.connect(`${env.MONGODB_URI}/${env.MONGODB_DATABASE}`);
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}

export async function getStatusDB(): Promise<"connected" | "disconnected"> {
  const status =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  return status;
}
