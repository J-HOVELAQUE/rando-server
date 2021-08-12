import { Request, Response } from "express";
import { v2 } from "cloudinary";
import { UploadedFile, FileArray } from "express-fileupload";
import Jimp from "jimp";
import path from "path";

const cloudinary = v2;

cloudinary.config({
  cloud_name: "dhov1sjr7",
  api_key: "157842163261796",
  api_secret: "MX3FORXNb-9duMrGfsI3RdJvvyg",
  secure: true,
});

export default async function uploadPlacePicture(req: Request, res: Response) {
  const newFiles = req.files;

  if (!newFiles) {
    res.json({ message: "no files" });
    return;
  }

  for (const file in newFiles) {
    const newFile = newFiles[file];
    if (Array.isArray(newFile)) {
      newFile.forEach((file) => {
        file.mv("./tmp/avatar.jpg");
      });
      res.json({
        message: "picts uploaded",
      });
      return;
    }
    // newFile.mv("./tmp/avatar.jpg");

    const uploadedPicture = await Jimp.read(newFile.data);
    uploadedPicture.resize(600, Jimp.AUTO);
    const savedResizedPicture = await uploadedPicture.writeAsync(
      "./tmp/resized.jpg"
    );

    console.log("AHAHAA", req.body);
  }

  res.json({
    message: "pict uploaded",
  });
}
