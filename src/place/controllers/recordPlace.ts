import { Request, Response } from "express";
import PlaceModel from "../model/PlaceModel";
import Joi, { ValidationError } from "joi";
import Jimp from "jimp";
import { UploadedFile, FileArray } from "express-fileupload";

const placeSchema = Joi.object({
  name: Joi.string().required(),
  mountainLocation: Joi.string().required(),
  altitudeInMeters: Joi.number().integer().required(),
  city: Joi.string(),
  picture: Joi.string(),
});

async function savePictureInCLoudinary(files: FileArray): Promise<string> {
  for (const file in files) {
    const newFile = files[file];
    if (Array.isArray(newFile)) {
      newFile.forEach((file) => {
        file.mv("./tmp/avatar.jpg");
      });

      return "OK";
    }
    const uploadedPicture = await Jimp.read(newFile.data);
    uploadedPicture.resize(600, Jimp.AUTO);
    const savedResizedPicture = await uploadedPicture.writeAsync(
      "./tmp/resized.jpg"
    );
  }
  return "OK";
}

export default async function (req: Request, res: Response) {
  const payload = req.body;

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
    savePictureInCLoudinary(req.files);
  }

  ///// Rec in database
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
