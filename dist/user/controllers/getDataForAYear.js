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
const buildUserRepository_1 = __importDefault(require("../repository/buildUserRepository"));
const userRepository = buildUserRepository_1.default();
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestDataResult = yield userRepository.getHikeData(req.params.userId);
        if (requestDataResult.outcome === "FAILURE") {
            if (requestDataResult.errorCode === "INVALID_ID") {
                res.status(400).json({
                    error: "Bad request",
                    detail: "invalid uuid",
                });
                return;
            }
            res.status(503).json({
                error: "databaseError",
                details: requestDataResult.detail,
            });
            return;
        }
        res.json({
            message: `here is the data for ${req.params.userId}`,
            data: requestDataResult.data,
        });
    });
}
exports.default = default_1;
