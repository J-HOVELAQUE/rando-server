import { Request, Response } from "express";
import express from "express";
import http from "http";
import morgan from "morgan";
import hikeRouter from "./hike/router";

// const express = require("express");

interface Server {
  start: () => void;
}

export default function buildServer(): Server {
  const app = express();
  const server = http.createServer(app);

  // Middlewares
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/hike", hikeRouter);

  return {
    start: () => {
      server.listen(3000, () => {
        console.log("Server listen on port 3000");
      });
    },
  };
}
