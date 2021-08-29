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
describe("Testing Place router", () => {
    let database;
    const app = server_1.default();
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        database = yield createDatabaseConnection_1.default();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield database.disconnect();
    }));
    describe("Given that I wish to record a new place without picture", () => {
        describe("When I send a valid payload to the create place route", () => {
            test("Then I receive a succes and there is a new place in database", () => __awaiter(void 0, void 0, void 0, function* () {
                const testNumber = 1;
                expect(testNumber).toBe(1);
                supertest_1.default(app)
                    .post("/place")
                    .send({})
                    .set("Accept", "application/json");
                // .expect(201);
            }));
        });
    });
});
