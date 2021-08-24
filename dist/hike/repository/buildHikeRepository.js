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
const HikeModel_1 = __importDefault(require("../model/HikeModel"));
const PlaceModel_1 = __importDefault(require("../../place/model/PlaceModel"));
const UserModel_1 = __importDefault(require("../../user/model/UserModel"));
function buildHikeRepository() {
    return {
        findAll: () => __awaiter(this, void 0, void 0, function* () {
            try {
                const hikesInDatabase = yield HikeModel_1.default.find();
                return {
                    outcome: "SUCCESS",
                    data: hikesInDatabase,
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
        create: (hikeToCreate) => __awaiter(this, void 0, void 0, function* () {
            try {
                const placeValidation = yield PlaceModel_1.default.findById(hikeToCreate.place);
                if (!placeValidation) {
                    return {
                        outcome: "FAILURE",
                        errorCode: "FOREIGN_KEY_ERROR",
                        detail: "The place doesn't exist",
                    };
                }
                for (const user of hikeToCreate.participants) {
                    const participantValidation = yield UserModel_1.default.findById(user);
                    if (!participantValidation) {
                        throw new Error("USER_ERROR");
                    }
                }
                const newHike = new HikeModel_1.default(hikeToCreate);
                const dbAnswer = yield newHike.save();
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
        }),
    };
}
exports.default = buildHikeRepository;
