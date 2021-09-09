import { Request, Response } from "express";
import buildUserRepository from "../repository/buildUserRepository";
import Joi, { ValidationError } from "joi";

const userRepository = buildUserRepository();

interface UserData {
  name?: String;
  firstname?: String;
  email?: string;
  dateOfBirth?: Date;
}

const userDataScheme = Joi.object({
  name: Joi.string(),
  firstname: Joi.string(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net", "fr"] },
  }),
  dateOfBirth: Joi.date(),
});

export default async function editUser(req: Request, res: Response) {
  const payload: UserData = req.body;
  const userToUpdateId: string = req.params.userId;

  ///// Payload validation
  const { error, value } = userDataScheme.validate(payload, {
    abortEarly: false,
  });

  if (error) {
    const errorMessages: String[] = error.details.map((err) => err.message);
    res.status(400).json({
      error: "payloadError",
      details: errorMessages,
    });
    return;
  }

  const updateResult = await userRepository.update(userToUpdateId, payload);

  if (updateResult.outcome === "FAILURE") {
    if (updateResult.errorCode === "CAST_ERROR") {
      res.status(400).json({
        error: "cast error",
        details: "invalid id",
      });
      return;
    }
    res.status(503).json({
      error: "databaseError",
      details: updateResult.detail,
    });
    return;
  }

  if (updateResult.data.nModified === 0) {
    res.status(200).json({
      message: "no document found or no change from old data",
      result: updateResult.data,
    });
    return;
  }
  res.json({ message: "update", result: updateResult.data });
}
