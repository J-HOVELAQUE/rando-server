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
const placeRepository = buildPlaceRepository_1.default();
function deletePlace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const deleteResult = yield placeRepository.delete(req.params.placeId);
        if (deleteResult.outcome === "FAILURE") {
            if (deleteResult.errorCode === "RELATIONAL_ERROR") {
                res.status(400).json({
                    message: "Deletion failed",
                    reason: "There is one or more hike in this place",
                });
                return;
            }
            res.status(503).json({
                message: "Deletion failed",
                reason: deleteResult.detail,
            });
            return;
        }
        res.json({ message: "place deleted", result: deleteResult.data });
    });
}
exports.default = deletePlace;
