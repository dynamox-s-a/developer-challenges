import * as dotenv from "dotenv";
import mongoose from "mongoose";
import { ServerStart } from "./server";

dotenv.config();

export const connection = mongoose
  .connect(process.env.MONGO_URL!, {
    dbName: "testData",
  })
  .then(() => {
    ServerStart();
    console.log("DB CONNECTION OK");
  })
  .catch((error: any) => {
    console.error("Error: ", error);
  });
