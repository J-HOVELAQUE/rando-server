import { Request, Response } from "express";
import PlaceModel from "../model/PlaceModel";

export default async function (req: Request, res: Response) {
  try {
    const placesInDatabase = await PlaceModel.find();
    res.status(200).json({
      message: `there is ${placesInDatabase.length} in database`,
      places: placesInDatabase,
    });
  } catch (error) {
    res.status(503).json({
      error: "databaseError",
      details: error,
    });
  }
}
