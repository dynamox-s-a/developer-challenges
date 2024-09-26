import { Request } from "express";

declare module "express" {
  export interface Request {
    user?: {
      _id: string;
      name: string;
      email: string;
      profile: string;
    };
    headers: Partial<{
      authorization: string;
    }> &
      Request["headers"];
  }
}
