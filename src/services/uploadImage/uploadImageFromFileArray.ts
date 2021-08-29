import { FileArray } from "express-fileupload";
import { OutcomeSuccess, OutcomeFailure } from "../../interfaces/outcomes";
import { v2 } from "cloudinary";
import Jimp from "jimp";
import { unlink } from "fs/promises";

const cloudinary = v2;
cloudinary.config({
  cloud_name: "dhov1sjr7",
  api_key: "157842163261796",
  api_secret: "MX3FORXNb-9duMrGfsI3RdJvvyg",
  secure: true,
});

type UploadResult = OutcomeSuccess<string> | OutcomeFailure;

export default async function uploadImageFromFileArray(
  files: FileArray,
  placeName: string
): Promise<UploadResult> {
  const fileArrayKeys = Object.keys(files);

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
}
