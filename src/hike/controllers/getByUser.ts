import { Request, Response } from "express";
import buildHikeRepository from "../repository/buildHikeRepository";

export default async function getHikeByUser(req: Request, res: Response) {
  const hikeRepository = buildHikeRepository();
  const hikesToFindResult = await hikeRepository.findByUser(req.params.userId);

  if (hikesToFindResult.outcome === "FAILURE") {
    if (hikesToFindResult.errorCode === "INVALID_ID") {
      res.status(400).json({
        error: "Bad request",
        detail: "invalid uuid",
      });
      return;
    }
    res.status(503).json({
      error: "databaseError",
      details: hikesToFindResult.detail,
    });
    return;
  }

  res.json({
    message: `there is ${hikesToFindResult.data.length} hikes in database for this user`,
    hikes: hikesToFindResult.data,
  });
}
