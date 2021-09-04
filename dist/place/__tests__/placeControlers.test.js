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
describe("Testing place controlers", () => {
    let database;
    const app = server_1.default();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        database = yield createDatabaseConnection_1.default();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database.connection.close();
    }));
    describe("POST /place", () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield PlaceModel_1.default.deleteMany();
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield PlaceModel_1.default.deleteMany();
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
                    const placesInDatabase = yield PlaceModel_1.default.find();
                    expect(placesInDatabase.length).toBe(1);
                    const placeInDatabase = placesInDatabase[0];
                    expect(placeInDatabase.altitudeInMeters).toBe(2030);
                    expect(placeInDatabase.mountainLocation).toBe("Chablais");
                    expect(placeInDatabase.name).toBe("Pointe de Chalune");
                    expect(placeInDatabase.__v).toBe(0);
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
        describe("Given that I try to record a new place with a name already in db", () => {
            describe("When I send a place with an existing name on the route", () => {
                it("Then I receive a status 409 and the place isn't recorded", () => __awaiter(void 0, void 0, void 0, function* () {
                    const placeInDb = new PlaceModel_1.default({
                        name: "Pointe de Chalune",
                        mountainLocation: "Chablais",
                        altitudeInMeters: 2030,
                    });
                    yield placeInDb.save();
                    const answer = yield supertest_1.default(app)
                        .post("/place")
                        .send({
                        name: "Pointe de Chalune",
                        mountainLocation: "Chablais",
                        altitudeInMeters: 2030,
                    })
                        .set("Accept", "application/json")
                        .expect(409);
                    expect(answer.body).toEqual({
                        error: "uniqueIndexError",
                        message: "a place with this name already existing",
                    });
                }));
            });
        });
    });
    describe("GET /place", () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield PlaceModel_1.default.deleteMany();
            const firstPlace = new PlaceModel_1.default({
                name: "Pointe de Chalune",
                mountainLocation: "Chablais",
                altitudeInMeters: 2030,
            });
            const secondPlace = new PlaceModel_1.default({
                name: "Le Môle",
                mountainLocation: "Chablais",
                altitudeInMeters: 1800,
            });
            yield firstPlace.save();
            yield secondPlace.save();
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield PlaceModel_1.default.deleteMany();
        }));
        describe("Given that I wish to get all places in database", () => {
            describe("When I request GET on the /place route", () => {
                it("It return 200 and places array and there is two places in db", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app).get("/place").expect(200);
                    expect(answer.body).toEqual({
                        message: "there is 2 in database",
                        places: [
                            {
                                __v: 0,
                                _id: expect.any(String),
                                altitudeInMeters: 2030,
                                mountainLocation: "Chablais",
                                name: "Pointe de Chalune",
                            },
                            {
                                __v: 0,
                                _id: expect.any(String),
                                altitudeInMeters: 1800,
                                mountainLocation: "Chablais",
                                name: "Le Môle",
                            },
                        ],
                    });
                    const firstId = answer.body.places[0]._id;
                    const secondId = answer.body.places[1]._id;
                    const placesInDatabase = yield PlaceModel_1.default.find();
                    expect(placesInDatabase.length).toBe(2);
                    const firstRecordedPlace = yield PlaceModel_1.default.findById(firstId);
                    const secondRecordedPlace = yield PlaceModel_1.default.findById(secondId);
                    expect(firstRecordedPlace).not.toBeNull();
                    expect(secondRecordedPlace).not.toBeNull();
                    if (firstRecordedPlace && secondRecordedPlace) {
                        expect(firstRecordedPlace.altitudeInMeters).toBe(2030);
                        expect(firstRecordedPlace.mountainLocation).toBe("Chablais");
                        expect(firstRecordedPlace.name).toBe("Pointe de Chalune");
                        expect(firstRecordedPlace.__v).toBe(0);
                        expect(secondRecordedPlace.altitudeInMeters).toBe(1800);
                        expect(secondRecordedPlace.mountainLocation).toBe("Chablais");
                        expect(secondRecordedPlace.name).toBe("Le Môle");
                        expect(secondRecordedPlace.__v).toBe(0);
                    }
                }));
            });
        });
    });
    describe("/PUT/:placeId", () => {
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
});
