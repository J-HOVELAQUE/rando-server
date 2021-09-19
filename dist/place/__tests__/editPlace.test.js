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
describe("PUT '/:placeId'", () => {
    let database;
    const app = server_1.default();
    let placeInDatabaseId;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        database = yield createDatabaseConnection_1.default();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database.connection.close();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield PlaceModel_1.default.deleteMany();
        const firstPlace = new PlaceModel_1.default({
            name: "Pointe de Chalune",
            mountainLocation: "Chablais",
            altitudeInMeters: 2030,
        });
        const placeInDatabase = yield firstPlace.save();
        placeInDatabaseId = placeInDatabase._id;
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield PlaceModel_1.default.deleteMany();
    }));
    describe("Given that I wish to update a place in database", () => {
        describe("When I PUT a valid payload and existing id as params on /place", () => {
            it("Then I receive a success and the document is updated", () => __awaiter(void 0, void 0, void 0, function* () {
                const answer = yield supertest_1.default(app)
                    .put("/place/" + placeInDatabaseId)
                    .send({
                    name: "Pointe de Marcelly",
                    altitudeInMeters: 1200,
                })
                    .set("Accept", "application/json")
                    .expect(200);
                expect(answer.body).toEqual({
                    message: "update",
                    result: {
                        n: 1,
                        nModified: 1,
                        ok: 1,
                    },
                });
                const updatedDocument = yield PlaceModel_1.default.findById(placeInDatabaseId);
                expect(updatedDocument).not.toBeNull();
                if (updatedDocument) {
                    expect(updatedDocument.altitudeInMeters).toBe(1200);
                    expect(updatedDocument.mountainLocation).toBe("Chablais");
                    expect(updatedDocument.name).toBe("Pointe de Marcelly");
                }
            }));
        });
    });
    describe("Given that I try tu update a Place in db with invalid payload", () => {
        describe("When I PUT an invalid payload on /place/:placeId", () => {
            it("Then I receive a failure and the place isn't updated", () => __awaiter(void 0, void 0, void 0, function* () {
                const answer = yield supertest_1.default(app)
                    .put("/place/" + placeInDatabaseId)
                    .send({
                    named: "Pointe de Marcelly",
                    altitudeInMeters: "mille",
                })
                    .set("Accept", "application/json")
                    .expect(400);
                expect(answer.body).toEqual({
                    details: [
                        '"altitudeInMeters" must be a number',
                        '"named" is not allowed',
                    ],
                    error: "payloadError",
                });
                const updatedDocument = yield PlaceModel_1.default.findById(placeInDatabaseId);
                expect(updatedDocument).not.toBeNull();
                if (updatedDocument) {
                    expect(updatedDocument.altitudeInMeters).toBe(2030);
                    expect(updatedDocument.mountainLocation).toBe("Chablais");
                    expect(updatedDocument.name).toBe("Pointe de Chalune");
                }
            }));
        });
    });
    describe("Given that I try tu update a Place with invalid id", () => {
        describe("When I give an invalid params to PUT /place/:placeId", () => {
            it("I receive a failure", () => __awaiter(void 0, void 0, void 0, function* () {
                const answer = yield supertest_1.default(app)
                    .put("/place/61236a11058423084474c16")
                    .send({
                    name: "Pointe de Marcelly",
                    altitudeInMeters: 1200,
                })
                    .set("Accept", "application/json")
                    .expect(400);
                expect(answer.body).toEqual({
                    error: "cast error",
                    details: "invalid id",
                });
            }));
        });
    });
    describe("Given that I wish to update an inexisting place", () => {
        describe("When I give an inexisting id as params", () => {
            it("Then I receive a success with ", () => __awaiter(void 0, void 0, void 0, function* () {
                const answer = yield supertest_1.default(app)
                    .put("/place/61236a11058423084474c161")
                    .send({
                    name: "Pointe de Marcelly",
                    altitudeInMeters: 1200,
                })
                    .set("Accept", "application/json")
                    .expect(200);
                expect(answer.body).toEqual({
                    message: "no document found or no change from old data",
                    result: {
                        n: 0,
                        nModified: 0,
                        ok: 1,
                    },
                });
            }));
        });
    });
});
