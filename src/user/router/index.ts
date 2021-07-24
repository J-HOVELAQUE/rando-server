import express, { Request, Response } from "express";
import { getUser } from "../controllers/getUser";
import { createUser } from "../controllers/createUser";

const userRouter = express.Router();

userRouter.get("/", getUser);

userRouter.post("/", createUser);

userRouter.put("/", (req: Request, res: Response) => {
  res.json({
    message: "Update an user",
  });
});

userRouter.delete("/", (req: Request, res: Response) => {
  res.json({
    message: "Deleting an user",
  });
});

export default userRouter;
