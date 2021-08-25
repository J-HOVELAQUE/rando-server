import { Request, Response } from "express";
import buildHikeRepository from "../repository/buildHikeRepository";

export default async function (req: Request, res: Response) {
  const hikeRepository = buildHikeRepository();
  const getHikesResult = await hikeRepository.findAll();

  if (getHikesResult.outcome === "FAILURE") {
    res.status(503).json({
      error: "databaseError",
      details: getHikesResult.detail,
    });
    return;
  }

  res.status(200).json({
    message: `there is ${getHikesResult.data.length} hikes in database`,
    places: getHikesResult.data,
  });
}
