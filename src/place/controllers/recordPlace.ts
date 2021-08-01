import { Request, Response } from "express";
import PlaceModel from "../model/PlaceModel";

export default async function (req: Request, res: Response) {
  const newPlace = new PlaceModel(req.body);

  newPlace.save();

  res.json({ message: "place recorded" });
}
