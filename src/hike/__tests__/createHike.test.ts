import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose, ObjectId } from "mongoose";
import supertest from "supertest";
import HikeModel from "../model/HikeModel";
import setupHikeTest from "./setupHikeTests";
import teardownHikeTests from "./teardownHikeTests";

describe("POST /hike", () => {
  let database: Mongoose;
  let placeInDatabaseId: string;
  let firstUserInDatabaseId: ObjectId;
  let secondUserInDatabaseId: ObjectId;
  const app = buildServer();

  beforeAll(async () => {
    database = await createConnection();
  });

  afterAll(async () => {
    await database.connection.close();
  });

  beforeEach(async () => {
    const setupResult = await setupHikeTest();
    placeInDatabaseId = setupResult.placeInDatabaseId;
    firstUserInDatabaseId = setupResult.firstUserInDatabaseId;
    secondUserInDatabaseId = setupResult.secondUserInDatabaseId;
  });

  afterEach(async () => {
    await teardownHikeTests();
  });

  describe("Given that I wish to record an hike with valid payload, place and participants", () => {
    describe("When I POST the valid payload to /hike", () => {
      it("Then I receive the success and 201 and the hike is recorded in database", async () => {
        const answer = await supertest(app)
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

        const hikesInDatabase = await HikeModel.find();
        expect(hikesInDatabase.length).toBe(1);
        expect(hikesInDatabase[0].durationInMinutes).toBe(120);
        expect(hikesInDatabase[0].arrivalAltitude).toBe(1900);
        expect(hikesInDatabase[0].date).toEqual(expect.any(Date));
        expect(hikesInDatabase[0].distanceInMeters).toBe(6000);
        expect(hikesInDatabase[0].elevationInMeters).toBe(900);
        expect(hikesInDatabase[0].startingAltitude).toBe(1000);
      });
    });
  });

  describe("Given that I try to record a new hike with invalid payload", () => {
    describe("When I POST an invalid paload on /hike", () => {
      it("Then I receive a failure and there is no hike in database", async () => {
        const answer = await supertest(app)
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

        const hikesInDatabase = await HikeModel.find();
        expect(hikesInDatabase.length).toBe(0);
      });
    });
  });

  describe("Given that I try to record a new hike with an inexisting place id", () => {
    describe("When I POST a payload with inexisting place on /hike", () => {
      it("Then I receive a failure and there is no hike in database", async () => {
        const answer = await supertest(app)
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

        const hikesInDatabase = await HikeModel.find();
        expect(hikesInDatabase.length).toBe(0);
      });
    });
  });

  describe("Given that I try to record a new hike with an inexisting user id", () => {
    describe("When I POST a payload with inexisting user on /hike", () => {
      it("Then I receive a failure and there is no hike in database", async () => {
        const answer = await supertest(app)
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

        const hikesInDatabase = await HikeModel.find();
        expect(hikesInDatabase.length).toBe(0);
      });
    });
  });
});
