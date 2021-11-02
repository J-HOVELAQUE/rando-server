import UserModel from "../model/UserModel";
import User from "../../interfaces/user";
import { OutcomeSuccess, OutcomeFailure } from "../../interfaces/outcomes";
import HikeModel from "../../hike/model/HikeModel";
import mongoose from "mongoose";

type UserRepositoryError =
  | "DATABASE_ERROR"
  | "UNIQUE_CONSTRAIN_ERROR"
  | "ID_NOT_FOUND"
  | "CAST_ERROR"
  | "RELATIONAL_ERROR"
  | "INVALID_ID";

interface UserRepositoryOutcomeFailure extends OutcomeFailure {
  errorCode: UserRepositoryError;
}

interface IHikeDataCategory {
  year: number;
  month: number;
}

interface IHikeData {
  _id: IHikeDataCategory;
  nb_hike: number;
  total_elev: number;
  total_dist: number;
  total_time: number;
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
  getHikeData: (userId: string) => Promise<ResultRepoMethod<IHikeData[]>>;
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
          return {
            outcome: "FAILURE",
            errorCode: "UNIQUE_CONSTRAIN_ERROR",
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

    getHikeData: async (userId: string) => {
      let userObjectId: mongoose.Types.ObjectId;

      try {
        userObjectId = mongoose.Types.ObjectId(userId);
      } catch (error: any) {
        return {
          outcome: "FAILURE",
          errorCode: "INVALID_ID",
          detail: error,
        };
      }

      try {
        const testAggregate = await HikeModel.aggregate()
          .match({
            participants: userObjectId,
          })
          .project(
            "-_id -startingAltitude -arrivalAltitude -__v -description -participants -place"
          )
          .group({
            _id: { year: { $year: "$date" }, month: { $month: "$date" } },
            nb_hike: { $sum: 1 },
            total_elev: { $sum: "$elevationInMeters" },
            total_dist: { $sum: "$distanceInMeters" },
            total_time: { $sum: "$durationInMinutes" },
          })
          .sort({
            _id: "asc",
          })
          .exec();

        return {
          outcome: "SUCCESS",
          data: testAggregate,
        };
      } catch (error: any) {
        return {
          outcome: "FAILURE",
          errorCode: "DATABASE_ERROR",
          detail: error,
        };
      }
    },
  };
}
