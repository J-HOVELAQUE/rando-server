import { Request, Response } from "express";
import PlaceModel from "../model/PlaceModel";
import Joi, { ValidationError } from "joi";

const placeSchema = Joi.object({
  name: Joi.string().required(),
  mountainLocation: Joi.string().required(),
  altitudeInMeters: Joi.number().integer().required(),
  city: Joi.string(),
  picture: Joi.string(),
});

export default async function (req: Request, res: Response) {
  const payload = req.body;

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

  try {
    const newPlace = new PlaceModel(req.body);
    await newPlace.save();
  } catch (error) {
    if (error.code && error.code === 11000) {
      res.status(409).json({
        error: "uniqueIndexError",
        message: "a place with this name already existing",
      });
      return;
    }
    res.status(503).json({
      error: "databaseError",
      details: error,
    });
    return;
  }

  res.status(201).json({ message: `place ${payload.name} recorded` });
}
