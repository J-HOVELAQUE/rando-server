"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getUser_1 = require("../controllers/getUser");
const createUser_1 = require("../controllers/createUser");
const userRouter = express_1.default.Router();
userRouter.get("/", getUser_1.getUser);
userRouter.post("/", createUser_1.createUser);
userRouter.put("/", (req, res) => {
    res.json({
        message: "Update an user",
    });
});
userRouter.delete("/", (req, res) => {
    res.json({
        message: "Deleting an user",
    });
});
exports.default = userRouter;
