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
describe("PUT /place/:placeId/location", () => {
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
        placeInDatabaseId = placeInDatabase.id;
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield PlaceModel_1.default.deleteMany();
    }));
    describe("Given that I wish to change the location of a place", () => {
        describe("When I PUT on /place/:placeId/location with valid payload and id", () => {
            it("Then I receive success and the place is updated", () => __awaiter(void 0, void 0, void 0, function* () {
                const answer = yield supertest_1.default(app)
                    .put("/place/" + placeInDatabaseId + "/location")
                    .send({
                    lat: 12.34,
                    long: 34.7655,
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
                const placeInDatabaseUpdated = yield PlaceModel_1.default.findById(placeInDatabaseId);
                expect(placeInDatabaseUpdated).not.toBeNull();
                if (placeInDatabaseUpdated) {
                    expect(placeInDatabaseUpdated.location.type).toBe("Point");
                    expect(placeInDatabaseUpdated.location.coordinates[0]).toBe(12.34);
                    expect(placeInDatabaseUpdated.location.coordinates[1]).toBe(34.7655);
                }
            }));
        });
    });
});
