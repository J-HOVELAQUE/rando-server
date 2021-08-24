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

  if (!Array.isArray(payload.participants)) {
    payload.participants = [payload.participants];
  }

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

  //// Rec in database
  const saveResult = await hikeRepository.create(payload);

  if (saveResult.outcome === "FAILURE") {
    res.status(503).json({
      error: "databaseError",
      errorCode: saveResult.errorCode,
      details: saveResult.detail,
    });
    return;
  }

  res.status(201).json({
    message: `hike recorded`,
    place: saveResult.data,
  });
}
