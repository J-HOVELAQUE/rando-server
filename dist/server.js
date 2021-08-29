"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./hike/router/index"));
const index_2 = __importDefault(require("./user/router/index"));
const index_3 = __importDefault(require("./place/router/index"));
const config_1 = __importDefault(require("config"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const ALLOWED_ORIGIN = config_1.default.get("allowedOrigin");
const port = config_1.default.get("port");
function buildServer() {
    const app = express_1.default();
    const server = http_1.default.createServer(app);
    // Middlewares
    app.use(morgan_1.default("dev"));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(express_fileupload_1.default());
    // Set the header for CORS policy //
    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
        res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS, PUT");
        next();
    });
    // Routers
    app.use("/hike", index_1.default);
    app.use("/user", index_2.default);
    app.use("/place", index_3.default);
    return app;
}
exports.default = buildServer;
