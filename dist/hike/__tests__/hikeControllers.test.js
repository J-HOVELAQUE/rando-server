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
const supertest_1 = __importDefault(require("supertest"));
const HikeModel_1 = __importDefault(require("../model/HikeModel"));
const PlaceModel_1 = __importDefault(require("../../place/model/PlaceModel"));
const UserModel_1 = __importDefault(require("../../user/model/UserModel"));
describe("Testing hike controllers", () => {
    let database;
    let placeInDatabaseId;
    let firstUserInDatabaseId;
    let secondUserInDatabaseId;
    const app = server_1.default();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        database = yield createDatabaseConnection_1.default();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database.connection.close();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield HikeModel_1.default.deleteMany();
        yield PlaceModel_1.default.deleteMany();
        yield UserModel_1.default.deleteMany();
        const placeInDb = new PlaceModel_1.default({
            name: "Pointe de Chalune",
            mountainLocation: "Chablais",
            altitudeInMeters: 2030,
        });
        const savePlaceResult = yield placeInDb.save();
        const firstUserInDatabase = new UserModel_1.default({
            name: "Lharicot",
            firstname: "Toto",
            email: "tot.lhar@gmail.fr",
        });
        const saveFirstUserInDatabaseResult = yield firstUserInDatabase.save();
        const secondUserInDatabase = new UserModel_1.default({
            name: "Golotte",
            firstname: "Marie",
            email: "mar.gol@gmail.fr",
        });
        const saveSecondUserInDatabaseResult = yield secondUserInDatabase.save();
        placeInDatabaseId = savePlaceResult.id;
        firstUserInDatabaseId = saveFirstUserInDatabaseResult._id;
        secondUserInDatabaseId = saveSecondUserInDatabaseResult._id;
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield HikeModel_1.default.deleteMany();
        yield PlaceModel_1.default.deleteMany();
        yield UserModel_1.default.deleteMany();
    }));
    describe("POST /hike", () => {
        describe("Given that I wish to record an hike with valid payload, place and participants", () => {
            describe("When I POST the valid payload to /hike", () => {
                it("Then I receive the success and 201 and the hike is recorded in database", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .post("/hike")
                        .send({
                        durationInMinutes: 120,
                        elevationInMeters: 900,
                        distanceInMeters: 6000,
                        startingAltitude: 1000,
                        arrivalAltitude: 1900,
                        description: "Très belle randonnée.",
                        date: "2021-12-03",
                        participants: [firstUserInDatabaseId, secondUserInDatabaseId],
                        place: placeInDatabaseId,
                    })
                        .set("Accept", "application/json")
                        .expect(201);
                    expect(answer.body).toEqual({
                        message: "hike recorded",
                        hike: {
                            __v: 0,
                            _id: expect.any(String),
                            arrivalAltitude: 1900,
                            date: "2021-12-03T00:00:00.000Z",
                            description: "Très belle randonnée.",
                            distanceInMeters: 6000,
                            durationInMinutes: 120,
                            elevationInMeters: 900,
                            participants: [expect.any(String), expect.any(String)],
                            place: expect.any(String),
                            startingAltitude: 1000,
                        },
                    });
                    const hikesInDatabase = yield HikeModel_1.default.find();
                    expect(hikesInDatabase.length).toBe(1);
                    expect(hikesInDatabase[0].durationInMinutes).toBe(120);
                    expect(hikesInDatabase[0].arrivalAltitude).toBe(1900);
                    expect(hikesInDatabase[0].date).toEqual(expect.any(Date));
                    expect(hikesInDatabase[0].distanceInMeters).toBe(6000);
                    expect(hikesInDatabase[0].elevationInMeters).toBe(900);
                    expect(hikesInDatabase[0].startingAltitude).toBe(1000);
                }));
            });
        });
        describe("Given that I try to record a new hike with invalid payload", () => {
            describe("When I POST an invalid paload on /hike", () => {
                it("Then I receive a failure and there is no hike in database", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .post("/hike")
                        .send({
                        durationInMinutes: 120,
                        distanceInMeters: 6000,
                        startingAltitude: "mille",
                        arrivalAltitude: 1900,
                        description: "Très belle randonnée.",
                        date: "date",
                        participants: [firstUserInDatabaseId, secondUserInDatabaseId],
                        place: placeInDatabaseId,
                    })
                        .set("Accept", "application/json")
                        .expect(400);
                    expect(answer.body).toEqual({
                        error: "payloadError",
                        details: [
                            '"elevationInMeters" is required',
                            '"startingAltitude" must be a number',
                            '"date" must be a valid date',
                        ],
                    });
                    const hikesInDatabase = yield HikeModel_1.default.find();
                    expect(hikesInDatabase.length).toBe(0);
                }));
            });
        });
        describe("Given that I try to record a new hike with an inexisting place id", () => {
            describe("When I POST a payload with inexisting place on /hike", () => {
                it("Then I receive a failure and there is no hike in database", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .post("/hike")
                        .send({
                        durationInMinutes: 120,
                        elevationInMeters: 900,
                        distanceInMeters: 6000,
                        startingAltitude: 1000,
                        arrivalAltitude: 1900,
                        description: "Très belle randonnée.",
                        date: "2021-12-03",
                        participants: [firstUserInDatabaseId, secondUserInDatabaseId],
                        place: "61236a11058423084474c166",
                    })
                        .set("Accept", "application/json")
                        .expect(409);
                    expect(answer.body).toEqual({
                        error: "database error",
                        details: "no place with this id in database",
                    });
                    const hikesInDatabase = yield HikeModel_1.default.find();
                    expect(hikesInDatabase.length).toBe(0);
                }));
            });
        });
        describe("Given that I try to record a new hike with an inexisting user id", () => {
            describe("When I POST a payload with inexisting user on /hike", () => {
                it("Then I receive a failure and there is no hike in database", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .post("/hike")
                        .send({
                        durationInMinutes: 120,
                        elevationInMeters: 900,
                        distanceInMeters: 6000,
                        startingAltitude: 1000,
                        arrivalAltitude: 1900,
                        description: "Très belle randonnée.",
                        date: "2021-12-03",
                        participants: [firstUserInDatabaseId, "61236a11058423084474c166"],
                        place: placeInDatabaseId,
                    })
                        .set("Accept", "application/json")
                        .expect(409);
                    expect(answer.body).toEqual({
                        error: "database error",
                        details: "no participant with this id in database",
                    });
                    const hikesInDatabase = yield HikeModel_1.default.find();
                    expect(hikesInDatabase.length).toBe(0);
                }));
            });
        });
    });
    describe("GET /hike", () => {
        let hikeIdInDatabase;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield HikeModel_1.default.deleteMany();
            const hikeInDatabase = new HikeModel_1.default({
                durationInMinutes: 120,
                elevationInMeters: 900,
                distanceInMeters: 6000,
                startingAltitude: 1000,
                arrivalAltitude: 1900,
                description: "Très belle randonnée.",
                date: "2021-12-03",
                participants: [firstUserInDatabaseId, secondUserInDatabaseId],
                place: placeInDatabaseId,
            });
            const saveResult = yield hikeInDatabase.save();
            hikeIdInDatabase = saveResult.id;
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield HikeModel_1.default.deleteMany();
        }));
        describe("Given that I wish to get all hike in database", () => {
            describe("When I GET on /hike with no params", () => {
                it("Then I receive success and an array with hike in db", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app).get("/hike").expect(200);
                    expect(answer.body).toEqual({
                        message: "there is 1 hikes in database",
                        hikes: [
                            {
                                __v: 0,
                                _id: expect.any(String),
                                arrivalAltitude: 1900,
                                date: "2021-12-03T00:00:00.000Z",
                                description: "Très belle randonnée.",
                                distanceInMeters: 6000,
                                durationInMinutes: 120,
                                elevationInMeters: 900,
                                participants: [expect.any(String), expect.any(String)],
                                place: expect.any(String),
                                startingAltitude: 1000,
                            },
                        ],
                    });
                }));
            });
        });
        describe("Given that I wish to get one hike in database", () => {
            describe("When I GET on /hike with existing hike id as params", () => {
                it("Then I receive success and data for this hike", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .get("/hike/" + hikeIdInDatabase)
                        .expect(200);
                    expect(answer.body).toEqual({
                        hike: {
                            __v: 0,
                            _id: hikeIdInDatabase,
                            arrivalAltitude: 1900,
                            date: "2021-12-03T00:00:00.000Z",
                            description: "Très belle randonnée.",
                            distanceInMeters: 6000,
                            durationInMinutes: 120,
                            elevationInMeters: 900,
                            participants: [
                                {
                                    __v: 0,
                                    _id: expect.any(String),
                                    email: "tot.lhar@gmail.fr",
                                    firstname: "Toto",
                                    name: "Lharicot",
                                },
                                {
                                    __v: 0,
                                    _id: expect.any(String),
                                    email: "mar.gol@gmail.fr",
                                    firstname: "Marie",
                                    name: "Golotte",
                                },
                            ],
                            place: expect.any(String),
                            startingAltitude: 1000,
                        },
                        message: "hike founded",
                    });
                }));
            });
        });
        describe("Given that I wish to get an inexisting hike in database", () => {
            describe("When I GET on /hike with inexisting hike id as params", () => {
                it("Then I receive success and data for this hike", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .get("/hike/61236a11058423084474c166")
                        .expect(404);
                    expect(answer.body).toEqual({
                        details: "there is no hike for this id",
                        error: "databaseError",
                    });
                }));
            });
        });
        describe("Given that I wish to get hikes in database for a place", () => {
            describe("When I GET on /hike/byPlace with existing place id as params", () => {
                it("Then I receive success and data for this hike", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .get("/hike/byPlace/" + placeInDatabaseId)
                        .expect(200);
                    expect(answer.body).toEqual({
                        hikes: [
                            {
                                __v: 0,
                                _id: expect.any(String),
                                arrivalAltitude: 1900,
                                date: "2021-12-03T00:00:00.000Z",
                                description: "Très belle randonnée.",
                                distanceInMeters: 6000,
                                durationInMinutes: 120,
                                elevationInMeters: 900,
                                participants: [
                                    {
                                        __v: 0,
                                        _id: expect.any(String),
                                        email: "tot.lhar@gmail.fr",
                                        firstname: "Toto",
                                        name: "Lharicot",
                                    },
                                    {
                                        __v: 0,
                                        _id: expect.any(String),
                                        email: "mar.gol@gmail.fr",
                                        firstname: "Marie",
                                        name: "Golotte",
                                    },
                                ],
                                place: {
                                    __v: 0,
                                    _id: expect.any(String),
                                    altitudeInMeters: 2030,
                                    mountainLocation: "Chablais",
                                    name: "Pointe de Chalune",
                                },
                                startingAltitude: 1000,
                            },
                        ],
                        message: "there is 1 hikes in database for this place",
                    });
                }));
            });
        });
    });
    describe("PUT /hike/:hikeId", () => {
        let hikeIdInDatabase;
        let hikeObjectIdInDatabase;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield HikeModel_1.default.deleteMany();
            const hikeInDatabase = new HikeModel_1.default({
                durationInMinutes: 120,
                elevationInMeters: 900,
                distanceInMeters: 6000,
                startingAltitude: 1000,
                arrivalAltitude: 1900,
                description: "Très belle randonnée.",
                date: "2021-12-03",
                participants: [firstUserInDatabaseId, secondUserInDatabaseId],
                place: placeInDatabaseId,
            });
            const saveResult = yield hikeInDatabase.save();
            hikeIdInDatabase = saveResult.id;
            hikeObjectIdInDatabase = saveResult._id;
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield HikeModel_1.default.deleteMany();
        }));
        describe("Given that I try to update hike data but not participant and place", () => {
            describe("When I PUT valid payload on /hike/:hikeId with other data", () => {
                it("I receive success and hike data is updated", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .put("/hike/" + hikeIdInDatabase)
                        .send({
                        durationInMinutes: 180,
                        elevationInMeters: 1100,
                        distanceInMeters: 6500,
                        arrivalAltitude: 2100,
                        description: "Trop cool!!!!",
                        date: "2021-08-03",
                        participants: [secondUserInDatabaseId],
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
                    const hikeData = yield HikeModel_1.default.findById(hikeIdInDatabase);
                    expect(hikeData).not.toBeNull();
                    if (hikeData) {
                        expect(hikeData.durationInMinutes).toBe(180);
                        expect(hikeData.elevationInMeters).toBe(1100);
                        expect(hikeData.distanceInMeters).toBe(6500);
                        expect(hikeData.arrivalAltitude).toBe(2100);
                        expect(hikeData.description).toBe("Trop cool!!!!");
                        expect(hikeData.date).toEqual(new Date("2021-08-03"));
                    }
                }));
            });
        });
        describe("Given that I try to update a place with an invalid payload", () => {
            describe("When I PUT an invalid payload on /hike/:hikeId", () => {
                it("Then I receive a faiure and the hike isn't updated", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .put("/hike/" + hikeIdInDatabase)
                        .send({
                        durationInMinutes: "Cent quatre vingt",
                        date: "Une Date",
                    })
                        .set("Accept", "application/json")
                        .expect(400);
                    expect(answer.body).toEqual({
                        details: [
                            '"durationInMinutes" must be a number',
                            '"date" must be a valid date',
                        ],
                        error: "payloadError",
                    });
                    const hikeData = yield HikeModel_1.default.findById(hikeIdInDatabase);
                    expect(hikeData).not.toBeNull();
                    if (hikeData) {
                        expect(hikeData.durationInMinutes).toBe(120);
                        expect(hikeData.date).toEqual(new Date("2021-12-03"));
                    }
                }));
            });
        });
    });
});
