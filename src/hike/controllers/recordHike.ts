import HikeModel from "../model/HikeModel";
import { Request, Response } from "express";
import Joi, { ValidationError } from "joi";
import buildHikeRepository from "../repository/buildHikeRepository";
import Hike from "../../interfaces/hike";

const hikeSchema = Joi.object({
  durationInMinutes: Joi.number().required(),
  elevationInMeters: Joi.number().required(),
  distanceInMeters: Joi.number().required(),
  startingAltitude: Joi.number().required(),
  arrivalAltitude: Joi.number().required(),
  description: Joi.string(),
  date: Joi.date().required(),
  participants: Joi.array().items(Joi.string()),
  place: Joi.string(),
});

const hikeRepository = buildHikeRepository();

export default async function (req: Request, res: Response) {
  const payload: Hike = req.body;

  //// Payload validation
  try {
    Joi.assert(payload, hikeSchema, {
      abortEarly: false,
    });
  } catch (error) {
    const errorReport: ValidationError = error;
    const errorMessages: String[] = errorReport.details.map(
      (err) => err.message
    );
    res.status(400).json({
      error: "payloadError",
      details: errorMessages,
    });
  }

  res.json({ message: "recorded" });
}
