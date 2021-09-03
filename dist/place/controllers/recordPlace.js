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
const buildPlaceRepository_1 = __importDefault(require("../repository/buildPlaceRepository"));
const uploadImageFromFileArray_1 = __importDefault(require("../../services/uploadImage/uploadImageFromFileArray"));
const placeRepository = buildPlaceRepository_1.default();
const placeSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    mountainLocation: joi_1.default.string().required(),
    altitudeInMeters: joi_1.default.number().integer().required(),
    city: joi_1.default.string(),
});
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = req.body;
        ///// Payload validation
        const { error, value } = placeSchema.validate(payload, { abortEarly: false });
        if (error) {
            const errorMessages = error.details.map((err) => err.message);
            res.status(400).json({
                error: "payloadError",
                details: errorMessages,
            });
            return;
        }
        ///// Rec picture
        if (req.files !== undefined) {
            const uploadResult = yield uploadImageFromFileArray_1.default(req.files, payload.name);
            if (uploadResult.outcome === "FAILURE") {
                res.status(400).json({
                    error: "payloadError",
                    errorCode: uploadResult.errorCode,
                    detail: uploadResult.detail,
                });
                return;
            }
            payload.picture = uploadResult.data;
        }
        ///// Rec in database
        const saveResult = yield placeRepository.create(payload);
        if (saveResult.outcome === "FAILURE") {
            if (saveResult.errorCode === "UNIQUE_CONSTRAIN_ERROR") {
                res.status(409).json({
                    error: "uniqueIndexError",
                    message: "a place with this name already existing",
                });
                return;
            }
            res.status(503).json({
                error: "databaseError",
                details: saveResult.detail,
            });
            return;
        }
        res.status(201).json({
            message: `place ${payload.name} recorded`,
            place: saveResult.data,
        });
    });
}
exports.default = default_1;
