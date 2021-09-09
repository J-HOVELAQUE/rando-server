import UserModel from "../model/UserModel";
import User from "../../interfaces/user";
import { OutcomeSuccess, OutcomeFailure } from "../../interfaces/outcomes";

type UserRepositoryError =
  | "DATABASE_ERROR"
  | "UNIQUE_CONSTRAIN_ERROR"
  | "ID_NOT_FOUND"
  | "CAST_ERROR"
  | "RELATIONAL_ERROR";

interface UserRepositoryOutcomeFailure extends OutcomeFailure {
  errorCode: UserRepositoryError;
}

type ResultRepoMethod<data> =
  | OutcomeSuccess<data>
  | UserRepositoryOutcomeFailure;

interface UserDataToUpdate {
  name?: String;
  firstname?: String;
  email?: string;
  dateOfBirth?: Date;
}

interface UserRepository {
  create: (userToCreate: User) => Promise<ResultRepoMethod<User>>;
  findAll: () => Promise<ResultRepoMethod<User[]>>;
  update: (
    userId: string,
    userData: UserDataToUpdate
  ) => Promise<ResultRepoMethod<any>>;
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
      } catch (error: any) {
        let errorCode: string = "DATABASE_ERROR";
        if (error.code && error.code === 11000) {
          errorCode = "UNIQUE_CONSTRAIN_ERROR";
        }
        return {
          outcome: "FAILURE",
          errorCode: "DATABASE_ERROR",
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
      } catch (error: any) {
        return {
          outcome: "FAILURE",
          errorCode: "DATABASE_ERROR",
          detail: error,
        };
      }
    },

    update: async (userId: string, userData: UserDataToUpdate) => {
      try {
        const result = await UserModel.updateOne({ _id: userId }, userData);

        return {
          outcome: "SUCCESS",
          data: result,
        };
      } catch (error: any) {
        if (error.name === "CastError") {
          return {
            outcome: "FAILURE",
            errorCode: "CAST_ERROR",
            detail: error,
          };
        }
        return {
          outcome: "FAILURE",
          errorCode: "DATABASE_ERROR",
          detail: error,
        };
      }
    },
  };
}
