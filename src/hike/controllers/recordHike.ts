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
    return;
  }

  //// Rec in database
  const saveResult = await hikeRepository.create(payload);

  if (saveResult.outcome === "FAILURE") {
    switch (saveResult.errorCode) {
      case "DATABASE_ERROR":
        res.status(503).json({
          error: "databaseError",
          errorCode: saveResult.errorCode,
          details: saveResult.detail,
        });
        return;

      case "FOREIGN_KEY_PLACE_ERROR":
        res.status(409).json({
          error: "database error",
          details: "no place with this id in database",
        });
        return;

      case "FOREIGN_KEY_USER_ERROR":
        res.status(409).json({
          error: "database error",
          details: "no participant with this id in database",
        });
        return;

      case "NO_HIKE":
        res.status(404).json({
          error: "database error",
          details: "there is no hike with this id in database",
        });
        return;

      case "UNIQUE_CONSTRAIN_ERROR":
        res.status(409).json({
          error: "database error",
          details: "there is an hike with this id already in database",
        });
        return;

      default:
        return;
    }
  }

  res.status(201).json({
    message: `hike recorded`,
    hike: saveResult.data,
  });
}
