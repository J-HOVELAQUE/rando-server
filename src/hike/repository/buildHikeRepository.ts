import HikeModel from "../model/HikeModel";
import Hike from "../../interfaces/hike";
import { OutcomeSuccess, OutcomeFailure } from "../../interfaces/outcomes";

type ResultRepoMethod<data> = OutcomeSuccess<data> | OutcomeFailure;

interface HikeRepository {
  create: (hikeToCreate: Hike) => Promise<ResultRepoMethod<Hike>>;
  findAll: () => Promise<ResultRepoMethod<Hike[]>>;
}

export default function buildHikeRepository(): HikeRepository {
  return {
    findAll: async () => {
      try {
        const hikesInDatabase = await HikeModel.find();
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
        return {
          outcome: "FAILURE",
          errorCode: errorCode,
          detail: error,
        };
      }
    },
  };
}
