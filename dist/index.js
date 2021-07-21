"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const mongoose_1 = __importDefault(require("mongoose"));
const uriConnection = "mongodb://localhost:27017/test";
const option = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
const app = server_1.default();
app.start();
function createConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const connection = yield mongoose_1.default.connect(uriConnection, option);
            console.log(`*** Database connection to  created ***`);
            return connection;
        }
        catch (err) {
            console.log("ERROR during database connection", err);
            throw err;
        }
    });
}
createConnection();
