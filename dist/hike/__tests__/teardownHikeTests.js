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
const HikeModel_1 = __importDefault(require("../model/HikeModel"));
const PlaceModel_1 = __importDefault(require("../../place/model/PlaceModel"));
const UserModel_1 = __importDefault(require("../../user/model/UserModel"));
function teardownHikeTests() {
    return __awaiter(this, void 0, void 0, function* () {
        yield HikeModel_1.default.deleteMany();
        yield PlaceModel_1.default.deleteMany();
        yield UserModel_1.default.deleteMany();
    });
}
exports.default = teardownHikeTests;
