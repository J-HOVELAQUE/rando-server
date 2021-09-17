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
const setupHikeTests_1 = __importDefault(require("./setupHikeTests"));
const teardownHikeTests_1 = __importDefault(require("./teardownHikeTests"));
describe("GET /hike", () => {
    let hikeIdInDatabase;
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
        const setupResult = yield setupHikeTests_1.default();
        placeInDatabaseId = setupResult.placeInDatabaseId;
        firstUserInDatabaseId = setupResult.firstUserInDatabaseId;
        secondUserInDatabaseId = setupResult.secondUserInDatabaseId;
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
        yield teardownHikeTests_1.default();
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
                                location: {
                                    coordinates: [],
                                },
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
