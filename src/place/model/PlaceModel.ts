import { Schema, model } from "mongoose";
import Place from "../../interfaces/place";

const placeSchema = new Schema<Place>({
  name: { type: String, required: true, unique: true },
  mountainLocation: { type: String, required: true },
  altitudeInMeters: { type: Number, required: true },
  city: String,
  picture: String,
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

const PlaceModel = model<Place>("Places", placeSchema);

export default PlaceModel;
