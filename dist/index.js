"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const initRepository_1 = __importDefault(require("./initRepository"));
const createDatabaseConnection_1 = __importDefault(require("./createDatabaseConnection"));
createDatabaseConnection_1.default();
const app = server_1.default(initRepository_1.default());
app.start();
