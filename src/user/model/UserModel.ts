import { Schema, model } from "mongoose";
import User from "../../interfaces/user";

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  firstname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateOfBirth: Date,
  photo: String,
});

const UserModel = model<User>("Users", userSchema);

export default UserModel;
