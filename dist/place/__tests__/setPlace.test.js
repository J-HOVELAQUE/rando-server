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
describe("GET '/place'", () => {
    let database;
    const app = server_1.default();
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
                            location: {
                                coordinates: [],
                            },
                        },
                        {
                            __v: 0,
                            _id: expect.any(String),
                            altitudeInMeters: 1800,
                            mountainLocation: "Chablais",
                            name: "Le Môle",
                            location: {
                                coordinates: [],
                            },
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
