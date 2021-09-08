"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recordHike_1 = __importDefault(require("../controllers/recordHike"));
const getHike_1 = __importDefault(require("../controllers/getHike"));
const getHikeByPlace_1 = __importDefault(require("../controllers/getHikeByPlace"));
const getHikeById_1 = __importDefault(require("../controllers/getHikeById"));
const editeHike_1 = __importDefault(require("../controllers/editeHike"));
const hikeRouter = express_1.default.Router();
hikeRouter.get("/", getHike_1.default);
hikeRouter.get("/:hikeId", getHikeById_1.default);
hikeRouter.get("/byPlace/:placeId", getHikeByPlace_1.default);
hikeRouter.post("/", recordHike_1.default);
hikeRouter.put("/:hikeId", editeHike_1.default);
hikeRouter.delete("/", (req, res) => {
    res.json({
        message: "Deleting an hike",
    });
});
exports.default = hikeRouter;
