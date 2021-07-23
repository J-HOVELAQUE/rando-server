import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: String,
  montainLocation: String,
  city: String,
  picture: String,
  hike: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hikes",
    },
  ],
});

const PlaceModel = mongoose.model("Places", placeSchema);

export default PlaceModel;
