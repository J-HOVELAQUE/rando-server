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
                        email: "tot.lhar@gmail.com",
                    })
                        .set("Accept", "application/json")
                        .expect(201);
                    expect(answer.body).toEqual({
                        message: "user Lharicot recorded",
                        place: {
                            __v: 0,
                            _id: expect.any(String),
                            email: "tot.lhargmail.co",
                            firstname: "Toto",
                            name: "Lharicot",
                        },
                    });
                }));
            });
        });
    });
});
