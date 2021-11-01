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
  console.log("PAYLOAD", req.body);

  ///// Payload validation
  const { error, value } = placeSchema.validate(req.body, {
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

  const payload: Place = { ...req.body };

  ///// Rec picture
  if (req.files) {
    console.log(">>>>FILES", req.files);

    const uploadResult = await uploadImageFromFileArray(
      req.files,
      req.body.name
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
