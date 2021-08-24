import { Schema, model } from "mongoose";
import Hike from "../../interfaces/hike";

const hikeSchema = new Schema<Hike>({
  durationInMinutes: Number,
  elevationInMeters: Number,
  distanceInMeters: Number,
  startingAltitude: Number,
  arrivalAltitude: Number,
  description: String,
  date: Date,
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  ],
  place: {
    type: Schema.Types.ObjectId,
    ref: "Places",
  },
});

const HikeModel = model<Hike>("Hikes", hikeSchema);

export default HikeModel;
