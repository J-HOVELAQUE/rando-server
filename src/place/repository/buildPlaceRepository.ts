import PlaceModel from "../model/PlaceModel";
import Place from "../../interfaces/place";
import { OutcomeSuccess, OutcomeFailure } from "../../interfaces/outcomes";

type ResultRepoMethod<data> = OutcomeSuccess<data> | OutcomeFailure;

interface PlaceRepository {
  create: (placeToCreate: Place) => Promise<ResultRepoMethod<Place>>;
  findAll: () => Promise<ResultRepoMethod<Place[]>>;
  findOne: (id: string) => Promise<ResultRepoMethod<Place>>;
}

export default function buildPlaceRepository(): PlaceRepository {
  return {
    create: async (placeToCreate: Place) => {
      try {
        const newPlace = new PlaceModel(placeToCreate);
        const dbAnswer = await newPlace.save();
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
        const placesInDatabase = await PlaceModel.find();
        return {
          outcome: "SUCCESS",
          data: placesInDatabase,
        };
      } catch (error) {
        return {
          outcome: "FAILURE",
          errorCode: "DATABASE_ERROR",
          detail: error,
        };
      }
    },

    findOne: async (id: string) => {
      try {
        const searchedPlace = await PlaceModel.findById(id);
        if (searchedPlace === null) {
          return {
            outcome: "FAILURE",
            errorCode: "ID_NOT_FOUND",
          };
        }
        return {
          outcome: "SUCCESS",
          data: searchedPlace,
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
