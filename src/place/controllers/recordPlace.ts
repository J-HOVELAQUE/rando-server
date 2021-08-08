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
    res.json({ errors: errorMessages });
    return;
  }
  const newPlace = new PlaceModel(req.body);

  newPlace.save();

  res.json({ message: `place ${payload.name} recorded` });
}
