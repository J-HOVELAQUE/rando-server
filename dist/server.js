"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
function server() {
    return {
        start: () => {
            const app = express_1.default();
            app.get("/", function (req, res) {
                res.send("Salut tous le monde");
            });
            app.listen(3000, function () {
                console.log("Serveur démarré");
            });
        },
    };
}
exports.default = server;
