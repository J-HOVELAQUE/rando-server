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
const uploadImageFromFileArray_1 = __importDefault(require("../../services/uploadImage/uploadImageFromFileArray"));
const placeRepository = buildPlaceRepository_1.default();
function editPlacePicture(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const placeId = req.params.placeId;
        /// Payload validation
        if (!req.files) {
            res.status(400).json({
                error: "No files send",
            });
            return;
        }
        const placeDataResult = yield placeRepository.findOne(placeId);
        if (placeDataResult.outcome === "FAILURE") {
            res.status(400).json({
                error: "No place with this id",
            });
            return;
        }
        /// Rec new picture
        const placeData = placeDataResult.data;
        const uploadResult = yield uploadImageFromFileArray_1.default(req.files, placeData.name);
        if (uploadResult.outcome === "FAILURE") {
            res.status(400).json({
                error: "upload error",
                errorCode: uploadResult.errorCode,
                detail: uploadResult.detail,
            });
            return;
        }
        const newPictureUrl = uploadResult.data;
        /// Rec new picture url in database
        const updateResult = yield placeRepository.update(placeId, {
            picture: newPictureUrl,
        });
        if (updateResult.outcome === "FAILURE") {
            res.status(400).json({
                error: "database error",
                detail: updateResult.errorCode,
            });
            return;
        }
        res.json({
            message: `Picture updated for place ${placeData.name}`,
            detail: updateResult.data,
        });
    });
}
exports.default = editPlacePicture;
