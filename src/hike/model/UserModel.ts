import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  firstname: String,
  dateOfBirth: Date,
  photo: String,
});

const UserModel = mongoose.model("Places", userSchema);

export default UserModel;
