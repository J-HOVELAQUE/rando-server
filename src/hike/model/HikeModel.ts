import mongoose from "mongoose";

const mapMarker = new mongoose.Schema({
  lat: Number,
  long: Number,
});

const hikeSchema = new mongoose.Schema({
  name: String,
  montainLocation: String,
  durationInMinutes: Number,
  elevationInMeters: Number,
  photo: String,
  distanceInMeters: Number,
  description: String,
  mapMarkers: [mapMarker],
});

const HikeModel = mongoose.model("Hikes", hikeSchema);

export default HikeModel;
