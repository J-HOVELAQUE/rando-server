import express, { Request, Response } from "express";
import recordPlace from "../controllers/recordPlace";
import getPlace from "../controllers/getPlace";
import editPlaceData from "../controllers/editPlace";

const placeRouter = express.Router();

placeRouter.get("/", getPlace);

placeRouter.post("/", recordPlace);

placeRouter.put("/:placeId", editPlaceData);

placeRouter.delete("/", (req: Request, res: Response) => {
  res.json({
    message: "Deleting a place",
  });
});

export default placeRouter;
