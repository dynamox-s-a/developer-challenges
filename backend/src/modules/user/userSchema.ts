import { IUser } from "./IUser";
import { Schema, model } from "mongoose";
import { compareHash, generateHash } from "../../shared/utils/passwordHashing";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email obrigatório",
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "A senha deve possui no mínimo 8 caracteres."],
    select: false,
  },
  profile: { type: String, required: true },
});

userSchema.pre("save", async function (next: any) {
  if (this.password && this.isModified("password")) {
    this.password = await generateHash(this.password);
  }
  next();
});

userSchema.methods.correctPassword = async function (
  password: string,
  userPassword: string,
) {
  return await compareHash(password, userPassword);
};

const USER = model("User", userSchema);
export default USER;
