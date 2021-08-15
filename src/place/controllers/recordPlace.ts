import { Request, Response } from "express";
import PlaceModel from "../model/PlaceModel";
import Joi, { ValidationError } from "joi";
import Jimp from "jimp";
import { UploadedFile, FileArray } from "express-fileupload";
import { v2 } from "cloudinary";
import { unlink } from "fs/promises";
import buildPlaceRepository from "../repository/buildPlaceRepository";

const cloudinary = v2;
const placeRepository = buildPlaceRepository();

interface Place {
  name: string;
  mountainLocation: string;
  altitudeInMeters: number;
  city?: string;
  picture?: string;
}

cloudinary.config({
  cloud_name: "dhov1sjr7",
  api_key: "157842163261796",
  api_secret: "MX3FORXNb-9duMrGfsI3RdJvvyg",
  secure: true,
});

const placeSchema = Joi.object({
  name: Joi.string().required(),
  mountainLocation: Joi.string().required(),
  altitudeInMeters: Joi.number().integer().required(),
  city: Joi.string(),
});

async function savePictureInCLoudinary(
  files: FileArray,
  namePlace: string
): Promise<string> {
  let pictureUrl: string = "";

  for (const fileName in files) {
    const newFile = files[fileName];

    if (Array.isArray(newFile)) {
      newFile.forEach((file) => {
        file.mv("./tmp/avatar.jpg");
      });
      return "OK";
    }

    const tempPicturePath: string = "./tmp/" + newFile.name;

    const uploadedPicture = await Jimp.read(newFile.data);
    uploadedPicture.resize(600, Jimp.AUTO);
    const savedResizedPicture = await uploadedPicture.writeAsync(
      tempPicturePath
    );

    const resultCloudinary = await cloudinary.uploader.upload(
      `./tmp/${newFile.name}`,
      {
        public_id: "rando/places/" + namePlace,
      }
    );
    pictureUrl = resultCloudinary.url;
    unlink(tempPicturePath);
  }

  return pictureUrl;
}

export default async function (req: Request, res: Response) {
  const payload: Place = req.body;
  // let pictureUrl: string = "";

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
    payload.picture = await savePictureInCLoudinary(req.files, payload.name);
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
