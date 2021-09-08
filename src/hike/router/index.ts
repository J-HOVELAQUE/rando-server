import express, { Request, Response } from "express";
import recordHike from "../controllers/recordHike";
import getHike from "../controllers/getHike";
import getHikeByPlace from "../controllers/getHikeByPlace";
import getHikeById from "../controllers/getHikeById";
import editHikeData from "../controllers/editeHike";

const hikeRouter = express.Router();

hikeRouter.get("/", getHike);

hikeRouter.get("/:hikeId", getHikeById);

hikeRouter.get("/byPlace/:placeId", getHikeByPlace);

hikeRouter.post("/", recordHike);

hikeRouter.put("/:hikeId", editHikeData);

hikeRouter.delete("/", (req: Request, res: Response) => {
  res.json({
    message: "Deleting an hike",
  });
});

export default hikeRouter;
