import { Request, Response } from "express";

export default async function (req: Request, res: Response) {
  res.json({ message: `here is the data for ${req.params.userId}` });
}
