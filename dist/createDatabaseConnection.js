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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const option = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
function createConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        let uriConnection = config_1.default.get("mongodb.uriConnection");
        console.log(">>>ENVIRONMENT", config_1.default.get("environment"));
        if (config_1.default.get("environment") === "prod") {
            console.log(">>>>>>>>>>>>>>>>>>>AHAHAHAHA");
            uriConnection = `mongodb+srv://${config_1.default.get("mongodb.user")}:${config_1.default.get("mongodb.password")}@lacapsule.fd7ap.mongodb.net/${config_1.default.get("mongodb.dbName")}?retryWrites=true&w=majority`;
        }
        try {
            const connection = mongoose_1.default.connect(uriConnection, option);
            console.log(`*** Database connection to ${uriConnection} created ***`);
            return connection;
        }
        catch (err) {
            console.log("ERROR during database connection", err);
            throw err;
        }
    });
}
exports.default = createConnection;
