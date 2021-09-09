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
describe("PUT /user/:userId", () => {
    let database;
    const app = server_1.default();
    let userIdAlreadyInDatabase;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        database = yield createDatabaseConnection_1.default();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database.connection.close();
    }));
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield UserModel_1.default.deleteMany();
        const userAlreadyInDatabase = new UserModel_1.default({
            name: "Lharicot",
            firstname: "Toto",
            email: "tot.lhar@gmail.fr",
            dateOfBirth: "1978-04-12",
        });
        const saveResult = yield userAlreadyInDatabase.save();
        userIdAlreadyInDatabase = saveResult.id;
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield UserModel_1.default.deleteMany();
    }));
    describe("Given that I wish to update user data for a user in db", () => {
        describe("When I PUT valid payload on valid id on /user/:userId", () => {
            it("Then I receive success on the user is updated", () => __awaiter(void 0, void 0, void 0, function* () {
                const answer = yield supertest_1.default(app)
                    .put("/user/" + userIdAlreadyInDatabase)
                    .send({
                    name: "Dupond",
                    firstname: "Toto",
                    email: "tot.lhar@gmail.com",
                    dateOfBirth: "1979-12-12",
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
                const updatedUser = yield UserModel_1.default.findById(userIdAlreadyInDatabase);
                expect(updatedUser).not.toBeNull();
                if (updatedUser) {
                    expect(updatedUser.name).toBe("Dupond");
                    expect(updatedUser.firstname).toBe("Toto");
                    expect(updatedUser.email).toBe("tot.lhar@gmail.com");
                    expect(updatedUser.dateOfBirth).toEqual(new Date("1979-12-12"));
                }
            }));
        });
    });
    describe("Given that I try to update a user with invalid payload", () => {
        describe("When I PUT invalid payload on /user/userId", () => {
            it("It return failure and user isn't updated", () => __awaiter(void 0, void 0, void 0, function* () {
                const answer = yield supertest_1.default(app)
                    .put("/user/" + userIdAlreadyInDatabase)
                    .send({
                    name: "Dupond",
                    firstname: "Toto",
                    email: "tot.lhar@gmail",
                    dateOfBirth: "1979-12-12",
                })
                    .set("Accept", "application/json")
                    .expect(400);
                expect(answer.body).toEqual({
                    details: ['"email" must be a valid email'],
                    error: "payloadError",
                });
                const updatedUser = yield UserModel_1.default.findById(userIdAlreadyInDatabase);
                expect(updatedUser).not.toBeNull();
                if (updatedUser) {
                    expect(updatedUser.name).toBe("Lharicot");
                    expect(updatedUser.firstname).toBe("Toto");
                    expect(updatedUser.email).toBe("tot.lhar@gmail.fr");
                    expect(updatedUser.dateOfBirth).toEqual(new Date("1978-04-12"));
                }
            }));
        });
    });
});
