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
const UserModel_1 = __importDefault(require("../model/UserModel"));
describe("Testing user controllers", () => {
    let database;
    const app = server_1.default();
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        database = yield createDatabaseConnection_1.default();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database.connection.close();
    }));
    describe("POST /user", () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield UserModel_1.default.deleteMany();
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield UserModel_1.default.deleteMany();
        }));
        describe("Given that I wish to record a new user without picture", () => {
            describe("When I send a valid payload POST on /user", () => {
                it("Then I receive a success and there is the new user in database", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .post("/user")
                        .send({
                        name: "Lharicot",
                        firstname: "Toto",
                        email: "tot.lhar@gmail.fr",
                    })
                        .set("Accept", "application/json")
                        .expect(201);
                    expect(answer.body).toEqual({
                        message: "user Lharicot recorded",
                        place: {
                            __v: 0,
                            _id: expect.any(String),
                            email: "tot.lhar@gmail.fr",
                            firstname: "Toto",
                            name: "Lharicot",
                        },
                    });
                    const userId = answer.body.place._id;
                    const allPlaceInDb = yield UserModel_1.default.find();
                    const userRecorded = yield UserModel_1.default.findById(userId);
                    expect(allPlaceInDb.length).toBe(1);
                    expect(userRecorded).not.toBeNull();
                    if (userRecorded) {
                        expect(userRecorded.email).toBe("tot.lhar@gmail.fr");
                        expect(userRecorded.firstname).toBe("Toto");
                        expect(userRecorded.name).toBe("Lharicot");
                    }
                }));
            });
        });
        describe("Given that I try to record a new user with invalid payload", () => {
            describe("When I POST on /user with an invalid email and without a name", () => {
                it("Then it return failure and there is no user recorded in database", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app)
                        .post("/user")
                        .send({
                        firstname: "Toto",
                        email: "tot.lhargmail.fr",
                    })
                        .set("Accept", "application/json")
                        .expect(400);
                    expect(answer.body).toEqual({
                        details: ['"name" is required', '"email" must be a valid email'],
                        error: "payloadError",
                    });
                    const usersInDatabase = yield UserModel_1.default.find();
                    expect(usersInDatabase.length).toBe(0);
                }));
            });
        });
        describe("Given that I try to record a new user in database with an existing email", () => {
            describe("When I POST on /user with an existing email in payload", () => {
                it("Then it return conflict and the user isn'nt recorded in database", () => __awaiter(void 0, void 0, void 0, function* () {
                    const userAlreadyInDatabase = new UserModel_1.default({
                        name: "Lharicot",
                        firstname: "Toto",
                        email: "tot.lhar@gmail.fr",
                    });
                    yield userAlreadyInDatabase.save();
                    const answer = yield supertest_1.default(app)
                        .post("/user")
                        .send({
                        name: "Tom",
                        firstname: "Jhon",
                        email: "tot.lhar@gmail.fr",
                    })
                        .set("Accept", "application/json")
                        .expect(409);
                    expect(answer.body).toEqual({
                        error: "uniqueIndexError",
                        message: "an user with this email already existing",
                    });
                    const usersRecordedInDatabase = yield UserModel_1.default.find();
                    expect(usersRecordedInDatabase.length).toBe(1);
                    expect(usersRecordedInDatabase[0].name).toBe("Lharicot");
                }));
            });
        });
    });
    describe("GET /user", () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield UserModel_1.default.deleteMany();
            const firstUser = new UserModel_1.default({
                name: "Lharicot",
                firstname: "Toto",
                email: "tot.lhar@gmail.fr",
            });
            const secondUser = new UserModel_1.default({
                name: "Bashung",
                firstname: "Alain",
                email: "al.bash@gmail.fr",
            });
            yield firstUser.save();
            yield secondUser.save();
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield UserModel_1.default.deleteMany();
        }));
        describe("Given that I wish to get all users recorded in database", () => {
            describe("When I request GET on /user route", () => {
                it("Then it return success and the two users recorded in database", () => __awaiter(void 0, void 0, void 0, function* () {
                    const answer = yield supertest_1.default(app).get("/user").expect(200);
                    expect(answer.body).toEqual({
                        message: "there is 2 users in database",
                        places: [
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
                                email: "al.bash@gmail.fr",
                                firstname: "Alain",
                                name: "Bashung",
                            },
                        ],
                    });
                }));
            });
        });
    });
});
