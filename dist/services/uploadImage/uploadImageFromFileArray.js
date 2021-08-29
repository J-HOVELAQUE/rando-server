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
const promises_1 = require("fs/promises");
const config_1 = __importDefault(require("config"));
const cloudinary = cloudinary_1.v2;
function uploadImageFromFileArray(files, placeName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (Object.keys(files).length > 1) {
                return {
                    outcome: "FAILURE",
                    errorCode: "INVALID_FILE",
                    detail: "Impossible to upload several files",
                };
            }
            let pictureUrl = "";
            for (const fileName in files) {
                const newFile = files[fileName];
                if (Array.isArray(newFile)) {
                    return {
                        outcome: "FAILURE",
                        errorCode: "INVALID_FILE",
                        detail: "Impossible to upload several files",
                    };
                }
                const tempPicturePath = "./tmp/" + newFile.name;
                const uploadedPicture = yield jimp_1.default.read(newFile.data);
                uploadedPicture.resize(600, jimp_1.default.AUTO);
                yield uploadedPicture.writeAsync(tempPicturePath);
                const cloudinaryConfig = {
                    cloud_name: config_1.default.get("cloudinary.cloud_name"),
                    api_key: config_1.default.get("cloudinary.api_key"),
                    api_secret: config_1.default.get("cloudinary.api_secret"),
                    secure: true,
                };
                cloudinary.config(cloudinaryConfig);
                const resultCloudinary = yield cloudinary.uploader.upload(`./tmp/${newFile.name}`, {
                    public_id: "rando/places/" + placeName,
                });
                pictureUrl = resultCloudinary.url;
                promises_1.unlink(tempPicturePath);
            }
            return {
                outcome: "SUCCESS",
                data: pictureUrl,
            };
        }
        catch (error) {
            console.log("EEERRRROR", error);
            return {
                outcome: "FAILURE",
                errorCode: "CLOUDINARY_ERROR",
                detail: error,
            };
        }
    });
}
exports.default = uploadImageFromFileArray;
