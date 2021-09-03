import { Request, Response } from "express";
import buildPlaceRepository from "../repository/buildPlaceRepository";
import Joi, { ValidationError } from "joi";

const placeRepository = buildPlaceRepository();

interface PlaceData {
  name?: string;
  mountainLocation?: string;
  altitudeInMeters?: number;
  city?: string;
}

const placeDataSchema = Joi.object({
  name: Joi.string(),
  mountainLocation: Joi.string(),
  altitudeInMeters: Joi.number().integer(),
  city: Joi.string(),
});

export default async function editPlaceData(req: Request, res: Response) {
  const payload: PlaceData = req.body;
  const placeToUpdateId: string = req.params.placeId;

  ///// Payload validation
  try {
    Joi.assert(payload, placeDataSchema, {
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

  const updateResult = await placeRepository.update(placeToUpdateId, payload);

  if (updateResult.outcome === "FAILURE") {
    res.status(503).json({
      error: "databaseError",
      details: updateResult.detail,
    });
    return;
  }

  res.json({ message: "update", result: updateResult.data });
}
