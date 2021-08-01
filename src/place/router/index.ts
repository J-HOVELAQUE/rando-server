import express, { Request, Response } from "express";
import recordPlace from "../controllers/recordPlace";
import getPlace from "../controllers/getPlace";

const placeRouter = express.Router();

placeRouter.get("/", getPlace);

placeRouter.post("/", recordPlace);

placeRouter.put("/", (req: Request, res: Response) => {
  res.json({
    message: "Update a place",
  });
});

placeRouter.delete("/", (req: Request, res: Response) => {
  res.json({
    message: "Deleting a place",
  });
});

export default placeRouter;
