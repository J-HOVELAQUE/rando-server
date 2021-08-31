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
const joi_1 = __importDefault(require("joi"));
const buildHikeRepository_1 = __importDefault(require("../repository/buildHikeRepository"));
const hikeSchema = joi_1.default.object({
    durationInMinutes: joi_1.default.number().required(),
    elevationInMeters: joi_1.default.number().required(),
    distanceInMeters: joi_1.default.number().required(),
    startingAltitude: joi_1.default.number().required(),
    arrivalAltitude: joi_1.default.number().required(),
    description: joi_1.default.string(),
    date: joi_1.default.date().required(),
    participants: joi_1.default.array().items(joi_1.default.string()),
    place: joi_1.default.string(),
});
const hikeRepository = buildHikeRepository_1.default();
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = req.body;
        if (!Array.isArray(payload.participants)) {
            payload.participants = [payload.participants];
        }
        //// Payload validation
        try {
            joi_1.default.assert(payload, hikeSchema, {
                abortEarly: false,
            });
        }
        catch (error) {
            const errorReport = error;
            const errorMessages = errorReport.details.map((err) => err.message);
            res.status(400).json({
                error: "payloadError",
                details: errorMessages,
            });
            return;
        }
        //// Rec in database
        const saveResult = yield hikeRepository.create(payload);
        if (saveResult.outcome === "FAILURE") {
            switch (saveResult.errorCode) {
                case "DATABASE_ERROR":
                    res.status(503).json({
                        error: "databaseError",
                        errorCode: saveResult.errorCode,
                        details: saveResult.detail,
                    });
                    return;
                case "FOREIGN_KEY_PLACE_ERROR":
                    res.status(409).json({
                        error: "database error",
                        details: "no place with this id in database",
                    });
                    return;
                case "FOREIGN_KEY_USER_ERROR":
                    res.status(409).json({
                        error: "database error",
                        details: "no participant with this id in database",
                    });
                    return;
                case "NO_HIKE":
                    res.status(404).json({
                        error: "database error",
                        details: "there is no hike with this id in database",
                    });
                    return;
                case "UNIQUE_CONSTRAIN_ERROR":
                    res.status(409).json({
                        error: "database error",
                        details: "there is an hike with this id already in database",
                    });
                    return;
                default:
                    return;
            }
        }
        res.status(201).json({
            message: `hike recorded`,
            place: saveResult.data,
        });
    });
}
exports.default = default_1;
