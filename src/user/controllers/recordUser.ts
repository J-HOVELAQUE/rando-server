import { Request, Response } from "express";
import UserModel from "../model/UserModel";
import Joi, { ValidationError } from "joi";
import buildUserRepository from "../repository/buildUserRepository";
import User from "../../interfaces/user";

const userSchema = Joi.object({
  name: Joi.string().required(),
  firstname: Joi.string().required(),
  email: Joi.string().required(),
  dateOfBirth: Joi.date(),
  photo: Joi.string(),
});

const userRepository = buildUserRepository();

export default async function (req: Request, res: Response) {
  // const newUser = new UserModel(req.body);
  const payload: User = req.body;
  console.log(">>>>>>>>", req.body);

  // await newUser.save();

  //// Payload validation
  try {
    Joi.assert(payload, userSchema, {
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
  }

  //// Rec in database
  const saveResult = await userRepository.create(payload);

  if (saveResult.outcome === "FAILURE") {
    if (saveResult.errorCode === "UNIQUE_CONSTRAIN_ERROR") {
      res.status(409).json({
        error: "uniqueIndexError",
        message: "an user with this email already existing",
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
    message: `user ${payload.name} recorded`,
    place: saveResult.data,
  });
}
