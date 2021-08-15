import { Request, Response } from "express";
import buildPlaceRepository from "../repository/buildPlaceRepository";

const placeRepository = buildPlaceRepository();

export default async function (req: Request, res: Response) {
  const getPlacesResult = await placeRepository.findAll();

  if (getPlacesResult.outcome === "FAILURE") {
    res.status(503).json({
      error: "databaseError",
      details: getPlacesResult.detail,
    });
    return;
  }

  res.status(200).json({
    message: `there is ${getPlacesResult.data.length} in database`,
    places: getPlacesResult.data,
  });
}
