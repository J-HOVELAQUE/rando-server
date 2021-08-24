"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const hikeSchema = new mongoose_1.Schema({
    durationInMinutes: Number,
    elevationInMeters: Number,
    distanceInMeters: Number,
    startingAltitude: Number,
    arrivalAltitude: Number,
    description: String,
    date: Date,
    participants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Users",
        },
    ],
    place: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Places",
    },
});
const HikeModel = mongoose_1.model("Hikes", hikeSchema);
exports.default = HikeModel;
