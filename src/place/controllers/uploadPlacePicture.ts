import { Request, Response } from "express";
import { v2 } from "cloudinary";
import { UploadedFile, FileArray } from "express-fileupload";

const cloudinary = v2;

cloudinary.config({
  cloud_name: "dhov1sjr7",
  api_key: "157842163261796",
  api_secret: "MX3FORXNb-9duMrGfsI3RdJvvyg",
  secure: true,
});

export default async function uploadPlacePicture(req: Request, res: Response) {
  // console.log(">>>>>>", req.files);

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
    newFile.mv("./tmp/avatar.jpg");

    console.log("AHAHAA");
  }

  res.json({
    message: "pict uploaded",
  });
}
