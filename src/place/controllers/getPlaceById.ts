import { Request, Response } from "express";
import buildPlaceRepository from "../repository/buildPlaceRepository";

const placeRepository = buildPlaceRepository();

export default async function getPlaceById(req: Request, res: Response) {
  const getResult = await placeRepository.findOne(req.params.placeId);

  if (getResult.outcome === "FAILURE") {
    res.status(400).json({
      message: "No place fonded",
      detail: getResult.errorCode,
    });
    return;
  }

  res.json({ message: "place founded", place: getResult.data });
}
