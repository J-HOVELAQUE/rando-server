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
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const getUserResult = yield userRepository.findAll();
        if (getUserResult.outcome === "FAILURE") {
            res.status(503).json({
                error: "databaseError",
                details: getUserResult.detail,
            });
            return;
        }
        res.status(200).json({
            message: `there is ${getUserResult.data.length} users in database`,
            places: getUserResult.data,
        });
    });
}
exports.default = getUser;
