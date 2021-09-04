import express from "express";
import recordPlace from "../controllers/recordPlace";
import getPlace from "../controllers/getPlace";
import editPlaceData from "../controllers/editPlace";
import deletePlace from "../controllers/deletePlace";

const placeRouter = express.Router();

placeRouter.get("/", getPlace);

placeRouter.post("/", recordPlace);

placeRouter.put("/:placeId", editPlaceData);

placeRouter.delete("/:placeId", deletePlace);

export default placeRouter;
