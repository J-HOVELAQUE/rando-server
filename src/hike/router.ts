import express, { Request, Response } from "express";
import recordHike from "./controllers/recordHike";

const hikeRouter = express.Router();

hikeRouter.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Get all hike in db",
  });
});

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
