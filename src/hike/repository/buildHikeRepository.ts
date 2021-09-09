import HikeModel from "../model/HikeModel";
import PlaceModel from "../../place/model/PlaceModel";
import UserModel from "../../user/model/UserModel";
import Hike from "../../interfaces/hike";
import { OutcomeSuccess, OutcomeFailure } from "../../interfaces/outcomes";
import mongoose, { ObjectId } from "mongoose";

type HikeRepositoryError =
  | "DATABASE_ERROR"
  | "NO_HIKE"
  | "FOREIGN_KEY_PLACE_ERROR"
  | "UNIQUE_CONSTRAIN_ERROR"
  | "FOREIGN_KEY_USER_ERROR"
  | "CAST_ERROR";

interface HikeRepositoryOutcomeFailure extends OutcomeFailure {
  errorCode: HikeRepositoryError;
}

type ResultRepoMethod<data> =
  | OutcomeSuccess<data>
  | HikeRepositoryOutcomeFailure;

interface HikeDataToUpdate {
  durationInMinutes?: number;
  elevationInMeters?: number;
  distanceInMeters?: number;
  startingAltitude?: number;
  arrivalAltitude?: number;
  description?: string;
  date?: Date;
  participants?: mongoose.Types.ObjectId[];
  place?: mongoose.Types.ObjectId;
}

interface HikeRepository {
  create: (hikeToCreate: Hike) => Promise<ResultRepoMethod<Hike>>;
  findAll: () => Promise<ResultRepoMethod<Hike[]>>;
  findByPlace: (placeId: string) => Promise<ResultRepoMethod<Hike[]>>;
  findById: (hikeId: string) => Promise<ResultRepoMethod<Hike>>;
  update: (
    hikeId: string,
    hikeData: HikeDataToUpdate
  ) => Promise<ResultRepoMethod<any>>;
  delete: (hikeId: string) => Promise<ResultRepoMethod<any>>;
}

export default function buildHikeRepository(): HikeRepository {
  return {
    findAll: async () => {
      try {
        const hikesInDatabase: Hike[] = await HikeModel.find();
        return {
          outcome: "SUCCESS",
          data: hikesInDatabase,
        };
      } catch (error: any) {
        return {
          outcome: "FAILURE",
          errorCode: "DATABASE_ERROR",
          detail: error,
        };
      }
    },

    findById: async (hikeId: string) => {
      try {
        const hikeForThisId: Hike | null = await HikeModel.findById(hikeId)
          .populate("participants")
          .exec();
        if (hikeForThisId === null) {
          return {
            outcome: "FAILURE",
            errorCode: "NO_HIKE",
            detail: "there is no hike for this id",
          };
        }

        return {
          outcome: "SUCCESS",
          data: hikeForThisId,
        };
      } catch (error: any) {
        return {
          outcome: "FAILURE",
          errorCode: "DATABASE_ERROR",
          detail: error,
        };
      }
    },

    findByPlace: async (placeId: string) => {
      try {
        const hikesInDatabase: Hike[] = await HikeModel.find({
          place: placeId,
        })
          .populate("participants")
          .populate("place")
          .exec();

        return {
          outcome: "SUCCESS",
          data: hikesInDatabase,
        };
      } catch (error: any) {
        return {
          outcome: "FAILURE",
          errorCode: "DATABASE_ERROR",
          detail: error,
        };
      }
    },

    create: async (hikeToCreate: Hike) => {
      try {
        const placeValidation = await PlaceModel.findById(hikeToCreate.place);

        if (!placeValidation) {
          return {
            outcome: "FAILURE",
            errorCode: "FOREIGN_KEY_PLACE_ERROR",
            detail: "The place doesn't exist",
          };
        }

        for (const user of hikeToCreate.participants) {
          const participantValidation = await UserModel.findById(user);
          if (!participantValidation) {
            throw new Error("USER_ERROR");
          }
        }

        const newHike = new HikeModel(hikeToCreate);
        const dbAnswer = await newHike.save();
        return {
          outcome: "SUCCESS",
          data: dbAnswer,
        };
      } catch (error: any) {
        if (error.code && error.code === 11000) {
          return {
            outcome: "FAILURE",
            errorCode: "UNIQUE_CONSTRAIN_ERROR",
            reason: "One or more user doesn't exist",
            detail: error,
          };
        }

        if (error.message === "USER_ERROR") {
          return {
            outcome: "FAILURE",
            errorCode: "FOREIGN_KEY_USER_ERROR",
            reason: "One or more user doesn't exist",
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

    update: async (hikeId: string, hikeData: HikeDataToUpdate) => {
      try {
        const result = await HikeModel.updateOne({ _id: hikeId }, hikeData);
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

    delete: async (hikeId: string) => {
      try {
        const deletionResult = await PlaceModel.deleteOne({ _id: hikeId });

        return {
          outcome: "SUCCESS",
          data: deletionResult,
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
