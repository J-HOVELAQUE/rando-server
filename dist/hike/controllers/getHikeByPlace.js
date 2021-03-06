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
function getHikeByPlace(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const hikeRepository = buildHikeRepository_1.default();
        const hikesToFindResult = yield hikeRepository.findByPlace(req.params.placeId);
        if (hikesToFindResult.outcome === "FAILURE") {
            res.status(503).json({
                error: "databaseError",
                details: hikesToFindResult.detail,
            });
            return;
        }
        res.json({
            message: `there is ${hikesToFindResult.data.length} hikes in database for this place`,
            hikes: hikesToFindResult.data,
        });
    });
}
exports.default = getHikeByPlace;
