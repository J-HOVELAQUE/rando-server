import mongoose from "mongoose";
import { Schema, model, connect } from "mongoose";

interface Place {
  name: String;
  montainLocation: String;
  city?: String;
  picture?: String;
}

const placeSchema = new Schema<Place>({
  name: { type: String, required: true },
  montainLocation: { type: String, required: true },
  city: String,
  picture: String,
});

const PlaceModel = model<Place>("Places", placeSchema);

export default PlaceModel;
