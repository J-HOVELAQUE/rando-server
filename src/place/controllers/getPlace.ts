import { Request, Response } from "express";
import PlaceModel from "../model/PlaceModel";

export default async function (req: Request, res: Response) {
  const placeInDatabase = await PlaceModel.find();
  res.json(placeInDatabase);
}
