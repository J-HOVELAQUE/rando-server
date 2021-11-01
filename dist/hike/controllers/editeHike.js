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
const buildHikeRepository_1 = __importDefault(require("../repository/buildHikeRepository"));
const joi_1 = __importDefault(require("joi"));
const hikeRepository = buildHikeRepository_1.default();
const hikeDataSchema = joi_1.default.object({
    durationInMinutes: joi_1.default.number().integer(),
    elevationInMeters: joi_1.default.number().integer(),
    distanceInMeters: joi_1.default.number().integer(),
    startingAltitude: joi_1.default.number().integer(),
    arrivalAltitude: joi_1.default.number().integer(),
    description: joi_1.default.string(),
    date: joi_1.default.date(),
    participants: joi_1.default.array().items(joi_1.default.string()),
    place: joi_1.default.string(),
});
function editHikeData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = req.body;
        const hikeToUpdateId = req.params.hikeId;
        console.log(payload);
        ///// Payload validation
        const { error, value } = hikeDataSchema.validate(payload, {
            abortEarly: false,
        });
        if (error) {
            const errorMessages = error.details.map((err) => err.message);
            res.status(400).json({
                error: "payloadError",
                details: errorMessages,
            });
            return;
        }
        const updateResult = yield hikeRepository.update(hikeToUpdateId, payload);
        if (updateResult.outcome === "FAILURE") {
            if (updateResult.errorCode === "CAST_ERROR") {
                res.status(400).json({
                    error: "cast error",
                    details: "invalid id",
                });
                return;
            }
            res.status(503).json({
                error: "databaseError",
                details: updateResult.detail,
            });
            return;
        }
        if (updateResult.data.nModified === 0) {
            res.status(200).json({
                message: "no document found or no change from old data",
                result: updateResult.data,
            });
            return;
        }
        res.json({ message: "update", result: updateResult.data });
    });
}
exports.default = editHikeData;
