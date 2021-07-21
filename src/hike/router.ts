import express, { Request, Response } from "express";

const hikeRouter = express.Router();

hikeRouter.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Get all hike in db",
  });
});

hikeRouter.post("/", (req: Request, res: Response) => {
  res.json({
    message: "Recording an hike",
  });
});

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
