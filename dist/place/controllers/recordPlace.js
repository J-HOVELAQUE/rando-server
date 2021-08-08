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
const joi_1 = __importDefault(require("joi"));
const placeSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    mountainLocation: joi_1.default.string().required(),
    altitudeInMeters: joi_1.default.number().integer().required(),
    city: joi_1.default.string(),
    picture: joi_1.default.string(),
});
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = req.body;
        try {
            joi_1.default.assert(payload, placeSchema, {
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
        try {
            const newPlace = new PlaceModel_1.default(req.body);
            yield newPlace.save();
        }
        catch (error) {
            if (error.code && error.code === 11000) {
                res.status(409).json({
                    error: "uniqueIndexError",
                    message: "a place with this name already existing",
                });
                return;
            }
            res.status(503).json({
                error: "databaseError",
                details: error,
            });
            return;
        }
        res.status(201).json({ message: `place ${payload.name} recorded` });
    });
}
exports.default = default_1;
