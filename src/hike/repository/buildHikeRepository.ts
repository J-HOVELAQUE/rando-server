import HikeModel from "../model/HikeModel";
import PlaceModel from "../../place/model/PlaceModel";
import UserModel from "../../user/model/UserModel";
import Hike from "../../interfaces/hike";
import Place from "../../interfaces/place";
import { OutcomeSuccess, OutcomeFailure } from "../../interfaces/outcomes";
import mongoose, { ObjectId } from "mongoose";

type ResultRepoMethod<data> = OutcomeSuccess<data> | OutcomeFailure;

interface HikeRepository {
  create: (hikeToCreate: Hike) => Promise<ResultRepoMethod<Hike>>;
  findAll: () => Promise<ResultRepoMethod<Hike[]>>;
  findByPlace: (placeId: string) => Promise<ResultRepoMethod<Hike[]>>;
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
      } catch (error) {
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
        });

        return {
          outcome: "SUCCESS",
          data: hikesInDatabase,
        };
      } catch (error) {
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
            errorCode: "FOREIGN_KEY_ERROR",
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
      } catch (error) {
        let errorCode: string = "DATABASE_ERROR";

        if (error.code && error.code === 11000) {
          errorCode = "UNIQUE_CONSTRAIN_ERROR";
        }

        if (error.message === "USER_ERROR") {
          return {
            outcome: "FAILURE",
            errorCode: "UNIQUE_CONSTRAIN_ERROR",
            reason: "One or more user doesn't exist",
            detail: error,
          };
        }
        return {
          outcome: "FAILURE",
          errorCode: errorCode,
          detail: error,
        };
      }
    },
  };
}
