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
describe("PUT /hike/:hikeId", () => {
    let database;
    let placeInDatabaseId;
    let firstUserInDatabaseId;
    let secondUserInDatabaseId;
    let hikeIdInDatabase;
    let hikeObjectIdInDatabase;
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
        hikeObjectIdInDatabase = saveResult._id;
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield teardownHikeTests_1.default();
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
