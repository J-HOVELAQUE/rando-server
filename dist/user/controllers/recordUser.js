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
const buildUserRepository_1 = __importDefault(require("../repository/buildUserRepository"));
const userSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    firstname: joi_1.default.string().required(),
    email: joi_1.default.string().required(),
    dateOfBirth: joi_1.default.date(),
    photo: joi_1.default.string(),
});
const userRepository = buildUserRepository_1.default();
function default_1(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const payload = req.body;
        //// Payload validation
        try {
            joi_1.default.assert(payload, userSchema, {
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
        }
        //// Rec in database
        const saveResult = yield userRepository.create(payload);
        if (saveResult.outcome === "FAILURE") {
            if (saveResult.errorCode === "UNIQUE_CONSTRAIN_ERROR") {
                res.status(409).json({
                    error: "uniqueIndexError",
                    message: "an user with this email already existing",
                });
                return;
            }
            res.status(503).json({
                error: "databaseError",
                errorCode: saveResult.errorCode,
                details: saveResult.detail,
            });
            return;
        }
        res.status(201).json({
            message: `user ${payload.name} recorded`,
            place: saveResult.data,
        });
    });
}
exports.default = default_1;