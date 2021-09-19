import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose, ObjectId } from "mongoose";
import supertest from "supertest";
import HikeModel from "../model/HikeModel";
import setupHikeTest from "./setupHikeTests";
import teardownHikeTests from "./teardownHikeTests";

describe("GET /hike", () => {
  let hikeIdInDatabase: string;
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
    const hikeInDatabase = new HikeModel({
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

    const saveResult = await hikeInDatabase.save();
    hikeIdInDatabase = saveResult.id;
  });

  afterEach(async () => {
    await teardownHikeTests();
  });

  describe("Given that I wish to get all hike in database", () => {
    describe("When I GET on /hike with no params", () => {
      it("Then I receive success and an array with hike in db", async () => {
        const answer = await supertest(app).get("/hike").expect(200);

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
      });
    });
  });

  describe("Given that I wish to get one hike in database", () => {
    describe("When I GET on /hike with existing hike id as params", () => {
      it("Then I receive success and data for this hike", async () => {
        const answer = await supertest(app)
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
            place: {
              __v: 0,
              _id: expect.any(String),
              altitudeInMeters: 2030,
              location: {
                coordinates: [],
              },
              mountainLocation: "Chablais",
              name: "Pointe de Chalune",
            },
            startingAltitude: 1000,
          },
          message: "hike founded",
        });
      });
    });
  });

  describe("Given that I wish to get an inexisting hike in database", () => {
    describe("When I GET on /hike with inexisting hike id as params", () => {
      it("Then I receive success and data for this hike", async () => {
        const answer = await supertest(app)
          .get("/hike/61236a11058423084474c166")
          .expect(404);

        expect(answer.body).toEqual({
          details: "there is no hike for this id",
          error: "databaseError",
        });
      });
    });
  });

  describe("Given that I wish to get hikes in database for a place", () => {
    describe("When I GET on /hike/byPlace with existing place id as params", () => {
      it("Then I receive success and data for this hike", async () => {
        const answer = await supertest(app)
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
      });
    });
  });
});
