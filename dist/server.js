"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
function server() {
    return {
        start: () => {
            const app = express();
            app.get("/", function (req, res) {
                res.json({ message: "coucou" });
            });
            app.listen(3000, function () {
                console.log("Serveur démarré");
            });
        },
    };
}
exports.default = server;
