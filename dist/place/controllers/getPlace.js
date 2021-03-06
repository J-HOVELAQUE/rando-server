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
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const getPlacesResult = yield placeRepository.findAll();
        if (getPlacesResult.outcome === "FAILURE") {
            res.status(503).json({
                error: "databaseError",
                details: getPlacesResult.detail,
            });
            return;
        }
        res.status(200).json({
            message: `there is ${getPlacesResult.data.length} places in database`,
            places: getPlacesResult.data,
        });
    });
}
exports.default = default_1;
