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
const HikeModel_1 = __importDefault(require("../../hike/model/HikeModel"));
const supertest_1 = __importDefault(require("supertest"));
describe("Testing place controlers", () => {
    let database;
    const app = server_1.default();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        database = yield createDatabaseConnection_1.default();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database.connection.close();
    }));
    describe("DELETE /place/:placeId", () => {
        let placeInDatabaseId;
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
        describe("Given that I want to delete a place in database", () => {
            describe("When I send a DELETE on /place route with the id of a place without hike", () => {
                it("It return success and the place is deleted", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .delete("/place/" + placeInDatabaseId)
                        .set("Accept", "application/json")
                        .expect(200);
                    expect(answer.body).toEqual({
                        message: "place deleted",
                        result: {
                            deletedCount: 1,
                            n: 1,
                            ok: 1,
                        },
                    });
                    const placeInDatabase = yield PlaceModel_1.default.find();
                    expect(placeInDatabase.length).toBe(0);
                }));
            });
        });
        describe("Given that I try to delete a place with hike", () => {
            describe("When I cast DELETE on /place with the id of a place with hike", () => {
                it("Then I receive failure and the place isn't deleted", () => __awaiter(void 0, void 0, void 0, function* () {
                    const hikeInDatabase = new HikeModel_1.default({
                        date: "2021-12-03",
                        durationInMinutes: 1200,
                        elevationInMeters: 300,
                        distanceInMeters: 1500,
                        startingAltitude: 1000,
                        arrivalAltitude: 1300,
                        place: placeInDatabaseId,
                    });
                    yield hikeInDatabase.save();
                    const answer = yield supertest_1.default(app)
                        .delete("/place/" + placeInDatabaseId)
                        .set("Accept", "application/json")
                        .expect(400);
                    expect(answer.body).toEqual({
                        message: "Deletion failed",
                        reason: "There is one or more hike in this place",
                    });
                    const placeInDatabase = yield PlaceModel_1.default.findById(placeInDatabaseId);
                    expect(placeInDatabase).not.toBeNull;
                    if (placeInDatabase) {
                        expect(placeInDatabase.name).toBe("Pointe de Chalune");
                    }
                }));
            });
        });
        describe("Given that I try to delete a place that doesn't exist in database", () => {
            describe("When I send an inexisting id to DELETE /place", () => {
                it("Then I receive succes with deletion result", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .delete("/place/612356a8fa3b67359c4a1a0f")
                        .set("Accept", "application/json")
                        .expect(200);
                    expect(answer.body).toEqual({
                        message: "place deleted",
                        result: {
                            deletedCount: 0,
                            n: 0,
                            ok: 1,
                        },
                    });
                }));
            });
        });
    });
});
