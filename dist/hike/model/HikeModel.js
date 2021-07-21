"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mapMarker = new mongoose_1.default.Schema({
    lat: Number,
    long: Number,
});
const hikeSchema = new mongoose_1.default.Schema({
    name: String,
    montainLocation: String,
    durationInMinutes: Number,
    elevationInMeters: Number,
    photo: String,
    distanceInMeters: Number,
    description: String,
    mapMarkers: [mapMarker],
});
const HikeModel = mongoose_1.default.model("Hikes", hikeSchema);
exports.default = HikeModel;
