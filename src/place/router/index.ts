import express from "express";
import recordPlace from "../controllers/recordPlace";
import getPlace from "../controllers/getPlace";
import editPlaceData from "../controllers/editPlace";
import deletePlace from "../controllers/deletePlace";
import editPlacePicture from "../controllers/editPlacePicture";
import setPlaceLocation from "../controllers/setPlaceLocation";
import getPlaceById from "../controllers/getPlaceById";

const placeRouter = express.Router();

placeRouter.get("/", getPlace);

placeRouter.get("/:placeId", getPlaceById);

placeRouter.post("/", recordPlace);

placeRouter.put("/:placeId", editPlaceData);

placeRouter.put("/:placeId/picture", editPlacePicture);

placeRouter.put("/:placeId/location", setPlaceLocation);

placeRouter.delete("/:placeId", deletePlace);

export default placeRouter;
