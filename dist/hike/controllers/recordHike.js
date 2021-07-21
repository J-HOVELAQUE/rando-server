"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HikeModel_1 = __importDefault(require("../model/HikeModel"));
function default_1(req, res) {
    console.log(">>>>>>>>>>>>>>>NAME", req.body.name);
    const newHike = new HikeModel_1.default({
        name: req.body.name,
    });
    newHike.save();
}
exports.default = default_1;
