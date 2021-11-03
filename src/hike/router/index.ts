import express, { Request, Response } from "express";
import recordHike from "../controllers/recordHike";
import getHike from "../controllers/getHike";
import getHikeByPlace from "../controllers/getHikeByPlace";
import getHikeById from "../controllers/getHikeById";
import editHikeData from "../controllers/editeHike";
import deleteHike from "../controllers/deleteHike";
import getHikeByUser from "../controllers/getByUser";

const hikeRouter = express.Router();

hikeRouter.get("/", getHike);

hikeRouter.get("/:hikeId", getHikeById);

hikeRouter.get("/byPlace/:placeId", getHikeByPlace);

hikeRouter.get("/byUser/:userId", getHikeByUser);

hikeRouter.post("/", recordHike);

hikeRouter.put("/:hikeId", editHikeData);

hikeRouter.delete("/:hikeId", deleteHike);

export default hikeRouter;
