import PlaceModel from "../model/PlaceModel";
import HikeModel from "../../hike/model/HikeModel";
import Place from "../../interfaces/place";
import { OutcomeSuccess, OutcomeFailure } from "../../interfaces/outcomes";

type PlaceRepositoryError =
  | "DATABASE_ERROR"
  | "UNIQUE_CONSTRAIN_ERROR"
  | "ID_NOT_FOUND"
  | "CAST_ERROR"
  | "RELATIONAL_ERROR";

interface PlaceRepositoryOutcomeFailure extends OutcomeFailure {
  errorCode: PlaceRepositoryError;
}

type ResultRepoMethod<data> =
  | OutcomeSuccess<data>
  | PlaceRepositoryOutcomeFailure;

interface PlaceDataToUpdate {
  name?: string;
  mountainLocation?: string;
  altitudeInMeters?: number;
  city?: string;
}

interface PlaceRepository {
  create: (placeToCreate: Place) => Promise<ResultRepoMethod<Place>>;
  findAll: () => Promise<ResultRepoMethod<Place[]>>;
  findOne: (id: string) => Promise<ResultRepoMethod<Place>>;
  update: (
    placeId: string,
    placeData: PlaceDataToUpdate
  ) => Promise<ResultRepoMethod<any>>;
  delete: (placeId: string) => Promise<ResultRepoMethod<any>>;
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
      } catch (error: any) {
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
        const placesInDatabase = await PlaceModel.find();
        return {
          outcome: "SUCCESS",
          data: placesInDatabase,
        };
      } catch (error: any) {
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
      } catch (error: any) {
        return {
          outcome: "FAILURE",
          errorCode: "DATABASE_ERROR",
          detail: error,
        };
      }
    },

    update: async (placeId: string, placeData: PlaceDataToUpdate) => {
      try {
        const result = await PlaceModel.updateOne({ _id: placeId }, placeData);

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

    delete: async (placeId: string) => {
      const hikeWithThisPlace = await HikeModel.find({ place: placeId });

      if (hikeWithThisPlace.length >= 1) {
        return {
          outcome: "FAILURE",
          errorCode: "RELATIONAL_ERROR",
          detail: "There is one or more hike in this place",
        };
      }

      try {
        const deletionResult = await PlaceModel.deleteOne({ _id: placeId });

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
