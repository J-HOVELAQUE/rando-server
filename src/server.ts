import { Request, Response } from "express";
import express from "express";
import http from "http";
import morgan from "morgan";
import hikeRouter from "./hike/router/index";
import userRouter from "./user/router/index";
import placeRouter from "./place/router/index";
import config from "config";
import fileUpload from "express-fileupload";

const ALLOWED_ORIGIN: string = config.get("allowedOrigin");
const port: number = config.get("port");

export interface RequestWithDeps extends Request {
  deps: any;
}

interface Server {
  start: () => void;
}

export default function buildServer(deps: any): Server {
  const app = express();
  const server = http.createServer(app);

  // Middlewares
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(fileUpload());

  // Set the header for CORS policy //
  app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PATCH, DELETE, OPTIONS, PUT"
    );
    next();
  });

  // Binding dependencies //
  // app.use(function (req: RequestWithDeps, res, next) {
  //   req.deps = deps;
  //   next()
  // })

  // Routers
  app.use("/hike", hikeRouter);
  app.use("/user", userRouter);
  app.use("/place", placeRouter);

  return {
    start: () => {
      server.listen(port, () => {
        console.log(`Server listen on port ${port}`);
      });
    },
  };
}
