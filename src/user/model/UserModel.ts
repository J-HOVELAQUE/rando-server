import mongoose from "mongoose";
import { Schema, model, connect } from "mongoose";

interface User {
  name: String;
  firstname: String;
  dateOfBirth?: Date;
  photo?: String;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  firstname: { type: String, required: true },
  dateOfBirth: Date,
  photo: String,
});

const UserModel = model<User>("Users", userSchema);

export default UserModel;
