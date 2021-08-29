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
const createDatabaseConnection_1 = __importDefault(require("../../createDatabaseConnection"));
const server_1 = __importDefault(require("../../server"));
const PlaceModel_1 = __importDefault(require("../model/PlaceModel"));
const supertest_1 = __importDefault(require("supertest"));
describe("POST /place", () => {
    let database;
    const app = server_1.default();
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        database = yield createDatabaseConnection_1.default();
        yield PlaceModel_1.default.deleteMany();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield PlaceModel_1.default.deleteMany();
        yield database.connection.close();
    }));
    describe("Given that I wish to record a new place without picture", () => {
        describe("When I send a valid payload to the create place route", () => {
            test("Then I receive a succes and there is a new place in database", () => __awaiter(void 0, void 0, void 0, function* () {
                const answer = yield supertest_1.default(app)
                    .post("/place")
                    .send({
                    name: "Pointe de Chalune",
                    mountainLocation: "Chablais",
                    altitudeInMeters: 2030,
                })
                    .set("Accept", "application/json")
                    .expect(201);
                expect(answer.body).toEqual({
                    message: "place Pointe de Chalune recorded",
                    place: {
                        __v: 0,
                        _id: expect.any(String),
                        altitudeInMeters: 2030,
                        mountainLocation: "Chablais",
                        name: "Pointe de Chalune",
                    },
                });
                const placeInDatabase = yield PlaceModel_1.default.find();
                // expect(placeInDatabase).toEqual([
                //   {
                //     __v: 0,
                //     _id: expect.anything(),
                //     altitudeInMeters: 2030,
                //     mountainLocation: "Chablais",
                //     name: "Pointe de Chalune",
                //   },
                // ]);
            }));
        });
    });
    describe("Given that I try to record a new place with invalid payload", () => {
        describe("When I send an invalit payload on the route", () => {
            it("Then I received an invalid payload error and the database is empty", () => __awaiter(void 0, void 0, void 0, function* () {
                const answer = yield supertest_1.default(app)
                    .post("/place")
                    .send({
                    name: "Pointe de Chalune",
                    mountainLocation: 12,
                })
                    .set("Accept", "application/json")
                    .expect(400);
                expect(answer.body).toEqual({
                    details: [
                        '"mountainLocation" must be a string',
                        '"altitudeInMeters" is required',
                    ],
                    error: "payloadError",
                });
                const placeInDatabase = yield PlaceModel_1.default.find();
                expect(placeInDatabase).toEqual([]);
            }));
        });
    });
});
