import { Document, Types } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export default class BaseModel extends Document {
  @ApiProperty({ type: "string", format: "objectId", required: false })
  _id: Types.ObjectId;

  deleted: boolean;

  createdAt: Date;

  updatedAt: Date;
}
