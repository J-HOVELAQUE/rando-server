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
const buildPlaceRepository_1 = __importDefault(require("../repository/buildPlaceRepository"));
const joi_1 = __importDefault(require("joi"));
const placeRepository = buildPlaceRepository_1.default();
const placeDataSchema = joi_1.default.object({
    name: joi_1.default.string(),
    mountainLocation: joi_1.default.string(),
    altitudeInMeters: joi_1.default.number().integer(),
    city: joi_1.default.string(),
});
function editPlaceData(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = req.body;
        const placeToUpdateId = req.params.placeId;
        ///// Payload validation
        try {
            joi_1.default.assert(payload, placeDataSchema, {
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
        const updateResult = yield placeRepository.update(placeToUpdateId, payload);
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
            res
                .status(200)
                .json({ message: "no document found", result: updateResult.data });
            return;
        }
        res.json({ message: "update", result: updateResult.data });
    });
}
exports.default = editPlaceData;
