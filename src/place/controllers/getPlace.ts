import { Request, Response } from "express";
import PlaceModel from "../model/PlaceModel";

export default async function (req: Request, res: Response) {
  try {
    const placesInDatabase = await PlaceModel.find();
    const places = placesInDatabase.map((place) => {
      return {
        _id: place._id,
        name: place.name,
        altitudeInMeters: place.altitudeInMeters,
        mountainLocation: place.mountainLocation,
        picture: place.picture,
        city: place.city,
      };
    });

    res.status(200).json({
      message: `there is ${placesInDatabase.length} in database`,
      places: places,
    });
  } catch (error) {
    res.status(503).json({
      error: "databaseError",
      details: error,
    });
  }
}
