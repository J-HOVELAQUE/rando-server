"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const hikeRouter = express_1.default.Router();
hikeRouter.get("/", (req, res) => {
    res.json({
        message: "Get all hike in db",
    });
});
hikeRouter.post("/", (req, res) => {
    res.json({
        message: "Recording an hike",
    });
});
hikeRouter.put("/", (req, res) => {
    res.json({
        message: "Update an hike",
    });
});
hikeRouter.delete("/", (req, res) => {
    res.json({
        message: "Deleting an hike",
    });
});
exports.default = hikeRouter;
