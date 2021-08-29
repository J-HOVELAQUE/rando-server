import { FileArray } from "express-fileupload";
import { OutcomeSuccess, OutcomeFailure } from "../../interfaces/outcomes";
import { v2 } from "cloudinary";
import Jimp from "jimp";
import { unlink } from "fs/promises";
import config from "config";

const cloudinary = v2;

interface CloudinaryConfig {
  cloud_name: string;
  api_key: string;
  api_secret: string;
  secure: boolean;
}

type UploadResult = OutcomeSuccess<string> | OutcomeFailure;

export default async function uploadImageFromFileArray(
  files: FileArray,
  placeName: string
): Promise<UploadResult> {
  try {
    if (Object.keys(files).length > 1) {
      return {
        outcome: "FAILURE",
        errorCode: "INVALID_FILE",
        detail: "Impossible to upload several files",
      };
    }

    let pictureUrl: string = "";

    for (const fileName in files) {
      const newFile = files[fileName];

      if (Array.isArray(newFile)) {
        return {
          outcome: "FAILURE",
          errorCode: "INVALID_FILE",
          detail: "Impossible to upload several files",
        };
      }

      const tempPicturePath: string = "./tmp/" + newFile.name;

      const uploadedPicture = await Jimp.read(newFile.data);
      uploadedPicture.resize(600, Jimp.AUTO);
      await uploadedPicture.writeAsync(tempPicturePath);

      const cloudinaryConfig: CloudinaryConfig = {
        cloud_name: config.get("cloudinary.cloud_name"),
        api_key: config.get("cloudinary.api_key"),
        api_secret: config.get("cloudinary.api_secret"),
        secure: true,
      };
      cloudinary.config(cloudinaryConfig);

      const resultCloudinary = await cloudinary.uploader.upload(
        `./tmp/${newFile.name}`,
        {
          public_id: "rando/places/" + placeName,
        }
      );
      pictureUrl = resultCloudinary.url;
      unlink(tempPicturePath);
    }

    return {
      outcome: "SUCCESS",
      data: pictureUrl,
    };
  } catch (error) {
    console.log("EEERRRROR", error);

    return {
      outcome: "FAILURE",
      errorCode: "CLOUDINARY_ERROR",
      detail: error,
    };
  }
}
