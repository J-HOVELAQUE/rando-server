import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose, ObjectId } from "mongoose";
import supertest from "supertest";
import HikeModel from "../model/HikeModel";
import setupHikeTest from "./setupHikeTests";
import teardownHikeTests from "./teardownHikeTests";

describe("PUT /hike/:hikeId", () => {
  let database: Mongoose;
  let placeInDatabaseId: string;
  let firstUserInDatabaseId: ObjectId;
  let secondUserInDatabaseId: ObjectId;
  let hikeIdInDatabase: string;
  let hikeObjectIdInDatabase: ObjectId;
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
    hikeObjectIdInDatabase = saveResult._id;
  });

  afterEach(async () => {
    await teardownHikeTests();
  });

  describe("Given that I try to update hike data but not participant and place", () => {
    describe("When I PUT valid payload on /hike/:hikeId with other data", () => {
      it("I receive success and hike data is updated", async () => {
        const answer = await supertest(app)
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

        const hikeData = await HikeModel.findById(hikeIdInDatabase);
        expect(hikeData).not.toBeNull();

        if (hikeData) {
          expect(hikeData.durationInMinutes).toBe(180);
          expect(hikeData.elevationInMeters).toBe(1100);
          expect(hikeData.distanceInMeters).toBe(6500);
          expect(hikeData.arrivalAltitude).toBe(2100);
          expect(hikeData.description).toBe("Trop cool!!!!");
          expect(hikeData.date).toEqual(new Date("2021-08-03"));
        }
      });
    });
  });

  describe("Given that I try to update a place with an invalid payload", () => {
    describe("When I PUT an invalid payload on /hike/:hikeId", () => {
      it("Then I receive a faiure and the hike isn't updated", async () => {
        const answer = await supertest(app)
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

        const hikeData = await HikeModel.findById(hikeIdInDatabase);

        expect(hikeData).not.toBeNull();

        if (hikeData) {
          expect(hikeData.durationInMinutes).toBe(120);
          expect(hikeData.date).toEqual(new Date("2021-12-03"));
        }
      });
    });
  });
});
