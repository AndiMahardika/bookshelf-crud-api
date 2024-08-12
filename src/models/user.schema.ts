import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
});

export const User = model("User", userSchema)