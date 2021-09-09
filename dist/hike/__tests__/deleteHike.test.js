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
describe("DELETE /hike/:hikeId", () => {
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
        hikeIdInDatabase = saveResult._id;
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield teardownHikeTests_1.default();
    }));
    describe("Given that I wish to delet an existing hike in database", () => {
        describe("When I DELETE on /hike/:hikeId With the id of the existing hike", () => {
            it("Then I receive success and the hike is removed from database", () => __awaiter(void 0, void 0, void 0, function* () {
                const answer = yield supertest_1.default(app)
                    .delete("/hike/" + hikeIdInDatabase)
                    .expect(200);
                expect(answer.body).toEqual({
                    message: "hike deleted",
                    result: {
                        deletedCount: 1,
                        n: 1,
                        ok: 1,
                    },
                });
                const hikesInDatabase = yield HikeModel_1.default.find();
                expect(hikesInDatabase.length).toEqual(0);
            }));
        });
    });
});
