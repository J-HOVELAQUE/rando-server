import { Request, Response } from "express";
import buildUserRepository from "../repository/buildUserRepository";

const userRepository = buildUserRepository();

export default async function (req: Request, res: Response) {
  const requestDataResult = await userRepository.getHikeData(req.params.userId);

  if (requestDataResult.outcome === "FAILURE") {
    if (requestDataResult.errorCode === "INVALID_ID") {
      res.status(400).json({
        error: "Bad request",
        detail: "invalid uuid",
      });
      return;
    }
    res.status(503).json({
      error: "databaseError",
      details: requestDataResult.detail,
    });
    return;
  }

  res.json({
    message: `here is the data for ${req.params.userId}`,
    data: requestDataResult.data,
  });
}
