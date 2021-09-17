"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const placeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    mountainLocation: { type: String, required: true },
    altitudeInMeters: { type: Number, required: true },
    city: String,
    picture: String,
    location: {
        type: {
            type: String,
            enum: ["Point"],
        },
        coordinates: {
            type: [Number],
        },
    },
});
const PlaceModel = mongoose_1.model("Places", placeSchema);
exports.default = PlaceModel;
