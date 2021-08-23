import UserModel from "../model/UserModel";
import User from "../../interfaces/user";
import { OutcomeSuccess, OutcomeFailure } from "../../interfaces/outcomes";

type ResultRepoMethod<data> = OutcomeSuccess<data> | OutcomeFailure;

interface UserRepository {
  create: (userToCreate: User) => Promise<ResultRepoMethod<User>>;
  findAll: () => Promise<ResultRepoMethod<User[]>>;
}

export default function buildUserRepository(): UserRepository {
  return {
    create: async (userToCreate: User) => {
      try {
        const newUser = new UserModel(userToCreate);
        const dbAnswer = await newUser.save();
        return {
          outcome: "SUCCESS",
          data: dbAnswer,
        };
      } catch (error) {
        let errorCode: string = "DATABASE_ERROR";
        if (error.code && error.code === 11000) {
          errorCode = "UNIQUE_CONSTRAIN_ERROR";
        }
        return {
          outcome: "FAILURE",
          errorCode: errorCode,
          detail: error,
        };
      }
    },

    findAll: async () => {
      try {
        const userInDatabase = await UserModel.find();
        return {
          outcome: "SUCCESS",
          data: userInDatabase,
        };
      } catch (error) {
        return {
          outcome: "FAILURE",
          errorCode: "DATABASE_ERROR",
          detail: error,
        };
      }
    },
  };
}
