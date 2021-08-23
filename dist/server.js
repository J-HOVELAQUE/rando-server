"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const morgan_1 = __importDefault(require("morgan"));
const router_1 = __importDefault(require("./hike/router"));
const index_1 = __importDefault(require("./user/router/index"));
const index_2 = __importDefault(require("./place/router/index"));
const config_1 = __importDefault(require("config"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const ALLOWED_ORIGIN = config_1.default.get("allowedOrigin");
function buildServer(deps) {
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
    // Binding dependencies //
    // app.use(function (req: RequestWithDeps, res, next) {
    //   req.deps = deps;
    //   next()
    // })
    // Routers
    app.use("/hike", router_1.default);
    app.use("/user", index_1.default);
    app.use("/place", index_2.default);
    return {
        start: () => {
            server.listen(3000, () => {
                console.log("Server listen on port 3000");
            });
        },
    };
}
exports.default = buildServer;
