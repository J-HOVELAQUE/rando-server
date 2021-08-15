"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const buildPlaceRepository_1 = __importDefault(require("./place/repository/buildPlaceRepository"));
function initRepository() {
    const placeRepository = buildPlaceRepository_1.default();
    console.log("*** Repository initialised");
    return {
        placeRepository,
    };
}
exports.default = initRepository;
