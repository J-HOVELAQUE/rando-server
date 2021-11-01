import { Request, Response } from "express";
import buildHikeRepository from "../repository/buildHikeRepository";
import Joi, { ValidationError } from "joi";
import mongoose from "mongoose";

const hikeRepository = buildHikeRepository();

interface HikeData {
  durationInMinutes?: number;
  elevationInMeters?: number;
  distanceInMeters?: number;
  startingAltitude?: number;
  arrivalAltitude?: number;
  description?: string;
  date?: Date;
  participants?: mongoose.Types.ObjectId[];
  place?: mongoose.Types.ObjectId;
}

const hikeDataSchema = Joi.object({
  durationInMinutes: Joi.number().integer(),
  elevationInMeters: Joi.number().integer(),
  distanceInMeters: Joi.number().integer(),
  startingAltitude: Joi.number().integer(),
  arrivalAltitude: Joi.number().integer(),
  description: Joi.string(),
  date: Joi.date(),
  participants: Joi.array().items(Joi.string()),
  place: Joi.string(),
});

export default async function editHikeData(req: Request, res: Response) {
  const payload: HikeData = req.body;
  const hikeToUpdateId: string = req.params.hikeId;

  console.log(payload);

  ///// Payload validation
  const { error, value } = hikeDataSchema.validate(payload, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages: String[] = error.details.map((err) => err.message);
    res.status(400).json({
      error: "payloadError",
      details: errorMessages,
    });
    return;
  }

  const updateResult = await hikeRepository.update(hikeToUpdateId, payload);

  if (updateResult.outcome === "FAILURE") {
    if (updateResult.errorCode === "CAST_ERROR") {
      res.status(400).json({
        error: "cast error",
        details: "invalid id",
      });
      return;
    }
    res.status(503).json({
      error: "databaseError",
      details: updateResult.detail,
    });
    return;
  }

  if (updateResult.data.nModified === 0) {
    res.status(200).json({
      message: "no document found or no change from old data",
      result: updateResult.data,
    });
    return;
  }
  res.json({ message: "update", result: updateResult.data });
}
