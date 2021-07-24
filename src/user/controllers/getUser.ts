import { Request, Response } from "express";
import UserModel from "../model/UserModel";

export async function getUser(req: Request, res: Response) {
  const users = await UserModel.find();

  res.json(users);
}
