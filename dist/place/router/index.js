"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recordPlace_1 = __importDefault(require("../controllers/recordPlace"));
const getPlace_1 = __importDefault(require("../controllers/getPlace"));
const editPlace_1 = __importDefault(require("../controllers/editPlace"));
const placeRouter = express_1.default.Router();
placeRouter.get("/", getPlace_1.default);
placeRouter.post("/", recordPlace_1.default);
placeRouter.put("/:placeId", editPlace_1.default);
placeRouter.delete("/", (req, res) => {
    res.json({
        message: "Deleting a place",
    });
});
exports.default = placeRouter;
