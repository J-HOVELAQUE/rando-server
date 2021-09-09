import express, { Request, Response } from "express";
import getUser from "../controllers/getUser";
import createUser from "../controllers/recordUser";
import editUser from "../controllers/editUser";

const userRouter = express.Router();

userRouter.get("/", getUser);

userRouter.post("/", createUser);

userRouter.put("/:userId", editUser);

userRouter.delete("/", (req: Request, res: Response) => {
  res.json({
    message: "Deleting an user",
  });
});

export default userRouter;
