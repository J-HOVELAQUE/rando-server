"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const getUser_1 = __importDefault(require("../controllers/getUser"));
const recordUser_1 = __importDefault(require("../controllers/recordUser"));
const editUser_1 = __importDefault(require("../controllers/editUser"));
const userRouter = express_1.default.Router();
userRouter.get("/", getUser_1.default);
userRouter.post("/", recordUser_1.default);
userRouter.put("/:userId", editUser_1.default);
userRouter.delete("/", (req, res) => {
    res.json({
        message: "Deleting an user",
    });
});
exports.default = userRouter;
