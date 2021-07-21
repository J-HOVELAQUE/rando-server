"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recordHike_1 = __importDefault(require("./controllers/recordHike"));
const hikeRouter = express_1.default.Router();
hikeRouter.get("/", (req, res) => {
    res.json({
        message: "Get all hike in db",
    });
});
hikeRouter.post("/", recordHike_1.default);
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
