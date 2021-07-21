import mongoose from "mongoose";

const hikeSchema = new mongoose.Schema({
  name: String,
});

const HikeModel = mongoose.model("Hikes", hikeSchema);

export default HikeModel;
