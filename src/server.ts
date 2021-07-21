import { Request, Response } from "express";
import express from "express";

// const express = require("express");

interface Server {
  start: () => void;
}

export default function server(): Server {
  return {
    start: () => {
      const app = express();

      app.get("/", function (req: Request, res: Response) {
        res.send("Salut tous le monde");
      });

      app.listen(3000, function () {
        console.log("Serveur démarré");
      });
    },
  };
}
