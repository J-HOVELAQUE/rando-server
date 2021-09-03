"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlaceModel_1 = __importDefault(require("../model/PlaceModel"));
function buildPlaceRepository() {
    return {
        create: (placeToCreate) => __awaiter(this, void 0, void 0, function* () {
            try {
                const newPlace = new PlaceModel_1.default(placeToCreate);
                const dbAnswer = yield newPlace.save();
                return {
                    outcome: "SUCCESS",
                    data: dbAnswer,
                };
            }
            catch (error) {
                let errorCode = "DATABASE_ERROR";
                if (error.code && error.code === 11000) {
                    errorCode = "UNIQUE_CONSTRAIN_ERROR";
                }
                return {
                    outcome: "FAILURE",
                    errorCode: errorCode,
                    detail: error,
                };
            }
        }),
        findAll: () => __awaiter(this, void 0, void 0, function* () {
            try {
                const placesInDatabase = yield PlaceModel_1.default.find();
                return {
                    outcome: "SUCCESS",
                    data: placesInDatabase,
                };
            }
            catch (error) {
                return {
                    outcome: "FAILURE",
                    errorCode: "DATABASE_ERROR",
                    detail: error,
                };
            }
        }),
        findOne: (id) => __awaiter(this, void 0, void 0, function* () {
            try {
                const searchedPlace = yield PlaceModel_1.default.findById(id);
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
            }
            catch (error) {
                return {
                    outcome: "FAILURE",
                    errorCode: "DATABASE_ERROR",
                    detail: error,
                };
            }
        }),
        update: (placeId, placeData) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield PlaceModel_1.default.updateOne({ _id: placeId }, placeData);
                return {
                    outcome: "SUCCESS",
                    data: result,
                };
            }
            catch (error) {
                return {
                    outcome: "FAILURE",
                    errorCode: "DATABASE_ERROR",
                    detail: error,
                };
            }
        }),
    };
}
exports.default = buildPlaceRepository;
