import { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import { connection } from "./connection";
import app from "./app";

// catch the listing of uncaughtExpections for synchronous code
process.on("uncaughtException", (error: any) => {
  console.error(error.message);
  console.error("Uncaught Exception!");
});

export const ServerStart = async () => {
  await connection;
  app.use((req: Request, res: Response, next: NextFunction) => {
    next();
  });
  createServer(app).listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
};
