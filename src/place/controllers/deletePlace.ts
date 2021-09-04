import { Request, Response } from "express";
import buildPlaceRepository from "../repository/buildPlaceRepository";

const placeRepository = buildPlaceRepository();

export default async function deletePlace(req: Request, res: Response) {
  const deleteResult = await placeRepository.delete(req.params.placeId);

  if (deleteResult.outcome === "FAILURE") {
    if (deleteResult.errorCode === "RELATIONAL_ERROR") {
      res.status(400).json({
        message: "Deletion failed",
        reason: "There is one or more hike in this place",
      });
      return;
    }
    res.status(503).json({
      message: "Deletion failed",
      reason: deleteResult.detail,
    });
    return;
  }
  res.json({ message: "place deleted", result: deleteResult.data });
}
