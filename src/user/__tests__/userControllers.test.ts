import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose } from "mongoose";
import supertest from "supertest";
import UserModel from "../model/UserModel";

describe("Testing user controllers", () => {
  let database: Mongoose;
  const app = buildServer();

  beforeAll(async () => {
    database = await createConnection();
  });

  afterAll(async () => {
    await database.connection.close();
  });

  describe("POST /user", () => {
    beforeEach(async () => {
      await UserModel.deleteMany();
    });

    afterEach(async () => {
      await UserModel.deleteMany();
    });

    describe("Given that I wish to record a new user without picture", () => {
      describe("When I send a valid payload POST on /user", () => {
        it("Then I receive a success and there is the new user in database", async () => {
          const answer = await supertest(app)
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
            user: {
              __v: 0,
              _id: expect.any(String),
              email: "tot.lhar@gmail.fr",
              firstname: "Toto",
              name: "Lharicot",
            },
          });

          const userId = answer.body.user._id;
          const allPlaceInDb = await UserModel.find();
          const userRecorded = await UserModel.findById(userId);

          expect(allPlaceInDb.length).toBe(1);
          expect(userRecorded).not.toBeNull();

          if (userRecorded) {
            expect(userRecorded.email).toBe("tot.lhar@gmail.fr");
            expect(userRecorded.firstname).toBe("Toto");
            expect(userRecorded.name).toBe("Lharicot");
          }
        });
      });
    });

    describe("Given that I try to record a new user with invalid payload", () => {
      describe("When I POST on /user with an invalid email and without a name", () => {
        it("Then it return failure and there is no user recorded in database", async () => {
          const answer = await supertest(app)
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

          const usersInDatabase = await UserModel.find();
          expect(usersInDatabase.length).toBe(0);
        });
      });
    });

    describe("Given that I try to record a new user in database with an existing email", () => {
      describe("When I POST on /user with an existing email in payload", () => {
        it("Then it return conflict and the user isn'nt recorded in database", async () => {
          const userAlreadyInDatabase = new UserModel({
            name: "Lharicot",
            firstname: "Toto",
            email: "tot.lhar@gmail.fr",
          });
          await userAlreadyInDatabase.save();

          const answer = await supertest(app)
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

          const usersRecordedInDatabase = await UserModel.find();

          expect(usersRecordedInDatabase.length).toBe(1);
          expect(usersRecordedInDatabase[0].name).toBe("Lharicot");
        });
      });
    });
  });

  describe("GET /user", () => {
    beforeEach(async () => {
      await UserModel.deleteMany();
      const firstUser = new UserModel({
        name: "Lharicot",
        firstname: "Toto",
        email: "tot.lhar@gmail.fr",
      });
      const secondUser = new UserModel({
        name: "Bashung",
        firstname: "Alain",
        email: "al.bash@gmail.fr",
      });
      await firstUser.save();
      await secondUser.save();
    });

    afterEach(async () => {
      await UserModel.deleteMany();
    });

    describe("Given that I wish to get all users recorded in database", () => {
      describe("When I request GET on /user route", () => {
        it("Then it return success and the two users recorded in database", async () => {
          const answer = await supertest(app).get("/user").expect(200);

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
        });
      });
    });
  });
});
