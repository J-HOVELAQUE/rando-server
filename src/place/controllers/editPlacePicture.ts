import { Request, Response } from "express";
import buildPlaceRepository from "../repository/buildPlaceRepository";
import uploadImageFromFileArray from "../../services/uploadImage/uploadImageFromFileArray";

const placeRepository = buildPlaceRepository();

export default async function editPlacePicture(req: Request, res: Response) {
  const placeId = req.params.placeId;

  /// Payload validation
  if (!req.files) {
    res.status(400).json({
      error: "No files send",
    });
    return;
  }

  const placeDataResult = await placeRepository.findOne(placeId);

  if (placeDataResult.outcome === "FAILURE") {
    res.status(400).json({
      error: "No place with this id",
    });
    return;
  }

  /// Rec new picture
  const placeData = placeDataResult.data;
  const uploadResult = await uploadImageFromFileArray(
    req.files,
    placeData.name
  );

  if (uploadResult.outcome === "FAILURE") {
    res.status(400).json({
      error: "upload error",
      errorCode: uploadResult.errorCode,
      detail: uploadResult.detail,
    });
    return;
  }
  const newPictureUrl: string = uploadResult.data;

  /// Rec new picture url in database
  const updateResult = await placeRepository.update(placeId, {
    picture: newPictureUrl,
  });

  if (updateResult.outcome === "FAILURE") {
    res.status(400).json({
      error: "database error",
      detail: updateResult.errorCode,
    });
    return;
  }

  res.json({
    message: `Picture updated for place ${placeData.name}`,
    detail: updateResult.data,
  });
}
