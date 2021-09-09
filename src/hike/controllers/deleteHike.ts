import { Request, Response } from "express";
import buildHikeRepository from "../repository/buildHikeRepository";

const hikeRepository = buildHikeRepository();

export default async function deleteHike(req: Request, res: Response) {
  const deleteResult = await hikeRepository.delete(req.params.hikeId);

  if (deleteResult.outcome === "FAILURE") {
    res.status(503).json({
      message: "Deletion failed",
      reason: deleteResult.detail,
    });
    return;
  }
  res.json({ message: "hike deleted", result: deleteResult.data });
}
