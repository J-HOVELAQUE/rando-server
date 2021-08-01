import mongoose from "mongoose";

const hikeSchema = new mongoose.Schema({
  durationInMinutes: Number,
  elevationInMeters: Number,
  distanceInMeters: Number,
  startingAltitude: Number,
  arrivalAltitude: Number,
  description: String,
  date: Date,
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  place: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Places",
  },
});

const HikeModel = mongoose.model("Hikes", hikeSchema);

export default HikeModel;
