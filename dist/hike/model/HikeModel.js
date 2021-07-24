"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const hikeSchema = new mongoose_1.default.Schema({
    durationInMinutes: Number,
    elevationInMeters: Number,
    distanceInMeters: Number,
    startingAltitude: Number,
    arrivalAltitude: Number,
    description: String,
    date: Date,
    participants: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
});
const HikeModel = mongoose_1.default.model("Hikes", hikeSchema);
exports.default = HikeModel;
