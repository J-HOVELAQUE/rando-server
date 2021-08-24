import User from "./user";
import Place from "./place";

export default interface Hike {
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
