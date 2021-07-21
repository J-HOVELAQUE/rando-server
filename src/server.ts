import { Request, Response } from "express";
import express from "express";
import http from "http";
import router from "./router";
import morgan from "morgan";

// const express = require("express");

interface Server {
  start: () => void;
}

export default function buildServer() {
  const app = express();
  const server = http.createServer(app);

  // Middlewares
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.use("/", router);

  return {
    start: () => {
      server.listen(3000, () => {
        console.log("Server listen on port 3000");
      });
    },
  };
}
