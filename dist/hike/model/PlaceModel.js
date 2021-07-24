"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const placeSchema = new mongoose_1.default.Schema({
    name: String,
    montainLocation: String,
    city: String,
    picture: String,
    hike: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Hikes",
        },
    ],
});
const PlaceModel = mongoose_1.default.model("Places", placeSchema);
exports.default = PlaceModel;
