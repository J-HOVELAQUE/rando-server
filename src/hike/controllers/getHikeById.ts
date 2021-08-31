import { Request, Response } from "express";
import buildHikeRepository from "../repository/buildHikeRepository";

export default async function (req: Request, res: Response) {
  const hikeRepository = buildHikeRepository();
  const getHikeResult = await hikeRepository.findById(req.params.hikeId);

  if (getHikeResult.outcome === "FAILURE") {
    res.status(404).json({
      error: "databaseError",
      details: getHikeResult.detail,
    });
    return;
  }

  res.json({
    message: "hike founded",
    hike: getHikeResult.data,
  });
}
