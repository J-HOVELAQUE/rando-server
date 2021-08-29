"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const createDatabaseConnection_1 = __importDefault(require("./createDatabaseConnection"));
const config_1 = __importDefault(require("config"));
const port = config_1.default.get("port");
console.log("Environment", process.env.NODE_ENV);
createDatabaseConnection_1.default();
const app = server_1.default();
app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
});
