import { Schema, model } from "mongoose";

interface Place {
  name: String;
  mountainLocation: String;
  altitudeInMeters: Number;
  city?: String;
  picture?: String;
}

const placeSchema = new Schema<Place>({
  name: { type: String, required: true },
  mountainLocation: { type: String, required: true },
  altitudeInMeters: { type: Number, required: true },
  city: String,
  picture: String,
});

const PlaceModel = model<Place>("Places", placeSchema);

export default PlaceModel;
