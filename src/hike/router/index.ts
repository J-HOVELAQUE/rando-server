import express, { Request, Response } from "express";
import recordHike from "../controllers/recordHike";
import getHike from "../controllers/getHike";
import getHikeByPlace from "../controllers/getHikeByPlace";

const hikeRouter = express.Router();

hikeRouter.get("/", getHike);

hikeRouter.get("/:placeId", getHikeByPlace);

hikeRouter.post("/", recordHike);

hikeRouter.put("/", (req: Request, res: Response) => {
  res.json({
    message: "Update an hike",
  });
});

hikeRouter.delete("/", (req: Request, res: Response) => {
  res.json({
    message: "Deleting an hike",
  });
});

export default hikeRouter;
