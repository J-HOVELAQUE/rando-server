import HikeModel from "../model/HikeModel";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  const hikesInDatabase = await HikeModel.find();
  res.json(hikesInDatabase);
}
