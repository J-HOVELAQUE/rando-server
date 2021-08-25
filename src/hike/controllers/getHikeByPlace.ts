import { Request, Response } from "express";
import buildHikeRepository from "../repository/buildHikeRepository";

export default async function getHikeByPlace(req: Request, res: Response) {
  const hikeRepository = buildHikeRepository();
  const hikesToFindResult = await hikeRepository.findByPlace(
    req.params.placeId
  );

  if (hikesToFindResult.outcome === "FAILURE") {
    res.status(503).json({
      error: "databaseError",
      details: hikesToFindResult.detail,
    });
    return;
  }

  res.json({
    message: `there is ${hikesToFindResult.data.length} hikes in database for this place`,
    hikes: hikesToFindResult.data,
  });
}
