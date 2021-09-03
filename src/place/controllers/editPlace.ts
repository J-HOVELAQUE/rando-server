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
  const { error, value } = placeDataSchema.validate(payload, {
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

  const updateResult = await placeRepository.update(placeToUpdateId, payload);

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
    res
      .status(200)
      .json({ message: "no document found", result: updateResult.data });
    return;
  }
  res.json({ message: "update", result: updateResult.data });
}
