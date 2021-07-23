import HikeModel from "../model/HikeModel";
import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  const newHike = new HikeModel(req.body);

  newHike.save();

  res.json({ message: "recorded" });
}
