import HikeModel from "../model/HikeModel";
import { Request, Response } from "express";

export default function (req: Request, res: Response) {
  console.log(">>>>>>>>>>>>>>>NAME", req.body.name);

  const newHike = new HikeModel({
    name: req.body.name,
  });

  newHike.save();
}
