import { Request, Response } from "express";
import UserModel from "../model/UserModel";

export async function createUser(req: Request, res: Response) {
  const newUser = new UserModel(req.body);

  await newUser.save();

  res.json({
    message: "new user created",
  });
}
