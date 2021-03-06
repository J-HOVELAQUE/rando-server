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
const cloudinary_1 = require("cloudinary");
const jimp_1 = __importDefault(require("jimp"));
const cloudinary = cloudinary_1.v2;
cloudinary.config({
    cloud_name: "dhov1sjr7",
    api_key: "157842163261796",
    api_secret: "MX3FORXNb-9duMrGfsI3RdJvvyg",
    secure: true,
});
function uploadPlacePicture(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newFiles = req.files;
        if (!newFiles) {
            res.json({ message: "no files" });
            return;
        }
        for (const file in newFiles) {
            const newFile = newFiles[file];
            if (Array.isArray(newFile)) {
                newFile.forEach((file) => {
                    file.mv("./tmp/avatar.jpg");
                });
                res.json({
                    message: "picts uploaded",
                });
                return;
            }
            // newFile.mv("./tmp/avatar.jpg");
            const uploadedPicture = yield jimp_1.default.read(newFile.data);
            uploadedPicture.resize(600, jimp_1.default.AUTO);
            const savedResizedPicture = yield uploadedPicture.writeAsync("./tmp/resized.jpg");
            console.log("AHAHAA", req.body);
        }
        res.json({
            message: "pict uploaded",
        });
    });
}
exports.default = uploadPlacePicture;
