import User from "./user";
import Place from "./place";
import mongoose from "mongoose";

export default interface Hike {
  _id: string;
  durationInMinutes: Number;
  elevationInMeters: Number;
  distanceInMeters: Number;
  startingAltitude: Number;
  arrivalAltitude: Number;
  description: String;
  date: Date;
  participants: mongoose.Types.ObjectId[];
  place: mongoose.Types.ObjectId;
}

export interface PopulatedHike {
  _id: string;
  durationInMinutes: Number;
  elevationInMeters: Number;
  distanceInMeters: Number;
  startingAltitude: Number;
  arrivalAltitude: Number;
  description: String;
  date: Date;
  participants: User[];
  place: Place;
}
