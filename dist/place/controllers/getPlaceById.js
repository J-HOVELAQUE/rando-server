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
function getPlaceById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const getResult = yield placeRepository.findOne(req.params.placeId);
        if (getResult.outcome === "FAILURE") {
            res.status(400).json({
                message: "No place fonded",
                detail: getResult.errorCode,
            });
            return;
        }
        res.json({ message: "place founded", place: getResult.data });
    });
}
exports.default = getPlaceById;
