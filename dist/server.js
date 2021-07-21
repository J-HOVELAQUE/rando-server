"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const router_1 = __importDefault(require("./router"));
const morgan_1 = __importDefault(require("morgan"));
function buildServer() {
    const app = express_1.default();
    const server = http_1.default.createServer(app);
    // Middlewares
    app.use(morgan_1.default("dev"));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use("/", router_1.default);
    return {
        start: () => {
            server.listen(3000, () => {
                console.log("Server listen on port 3000");
            });
        },
    };
}
exports.default = buildServer;
