import { Request, Response } from "express";
import UserModel from "../model/UserModel";
import buildPlaceRepository from "../../place/repository/buildPlaceRepository";
import buildUserRepository from "../repository/buildUserRepository";

const userRepository = buildUserRepository();

export default async function getUser(req: Request, res: Response) {
  const getUserResult = await userRepository.findAll();

  if (getUserResult.outcome === "FAILURE") {
    res.status(503).json({
      error: "databaseError",
      details: getUserResult.detail,
    });
    return;
  }

  res.status(200).json({
    message: `there is ${getUserResult.data.length} users in database`,
    places: getUserResult.data,
  });
}
