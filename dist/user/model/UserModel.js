"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    firstname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    dateOfBirth: Date,
    photo: String,
});
const UserModel = mongoose_1.model("Users", userSchema);
exports.default = UserModel;
