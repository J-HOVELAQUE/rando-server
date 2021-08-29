import { Request, Response } from "express";
import Joi, { ValidationError } from "joi";
import buildPlaceRepository from "../repository/buildPlaceRepository";
import uploadImageFromFileArray from "../../services/uploadImage/uploadImageFromFileArray";

const placeRepository = buildPlaceRepository();

interface Place {
  name: string;
  mountainLocation: string;
  altitudeInMeters: number;
  city?: string;
  picture?: string;
}

const placeSchema = Joi.object({
  name: Joi.string().required(),
  mountainLocation: Joi.string().required(),
  altitudeInMeters: Joi.number().integer().required(),
  city: Joi.string(),
});

export default async function (req: Request, res: Response) {
  const payload: Place = req.body;

  ///// Payload validation
  try {
    Joi.assert(payload, placeSchema, {
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

  ///// Rec picture
  if (req.files !== undefined) {
    const uploadResult = await uploadImageFromFileArray(
      req.files,
      payload.name
    );

    if (uploadResult.outcome === "FAILURE") {
      res.status(400).json({
        error: "payloadError",
        errorCode: uploadResult.errorCode,
        detail: uploadResult.detail,
      });
      return;
    }
    payload.picture = uploadResult.data;
  }

  ///// Rec in database
  const saveResult = await placeRepository.create(payload);

  if (saveResult.outcome === "FAILURE") {
    if (saveResult.errorCode === "UNIQUE_CONSTRAIN_ERROR") {
      res.status(409).json({
        error: "uniqueIndexError",
        message: "a place with this name already existing",
      });
      return;
    }
    res.status(503).json({
      error: "databaseError",
      details: saveResult.detail,
    });
    return;
  }

  res.status(201).json({
    message: `place ${payload.name} recorded`,
    place: saveResult.data,
  });
}
