import { Request, Response } from "express";
import buildPlaceRepository from "../repository/buildPlaceRepository";
import Joi, { ValidationError } from "joi";

const placeRepository = buildPlaceRepository();

const coordinatesSchema = Joi.object({
  lat: Joi.number().required(),
  long: Joi.number().required(),
});

interface Coordinates {
  lat: number;
  long: number;
}

export default async function setPlaceLocation(req: Request, res: Response) {
  const placeToUpdateId: string = req.params.placeId;

  ///// Payload validation
  const { error, value } = coordinatesSchema.validate(req.body, {
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

  ///// Setting location

  const coordinates: Coordinates = req.body;

  const updateResult = await placeRepository.setLocation(
    placeToUpdateId,
    coordinates
  );

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
