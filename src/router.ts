import express, { Request, Response } from "express";
// const express = require("express");

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome on Financial Forecast server",
  });
});

export default router;
