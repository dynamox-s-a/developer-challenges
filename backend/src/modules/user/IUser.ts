import { Types } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  password: string;
  email: string;
  profile: Types.ObjectId;
}
