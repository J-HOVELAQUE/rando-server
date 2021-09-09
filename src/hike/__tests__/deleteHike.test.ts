import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose, ObjectId } from "mongoose";
import supertest from "supertest";
import HikeModel from "../model/HikeModel";
import setupHikeTest from "./setupHikeTests";
import teardownHikeTests from "./teardownHikeTests";

describe("DELETE /hike/:hikeId", () => {
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
    hikeIdInDatabase = saveResult._id;
  });

  afterEach(async () => {
    await teardownHikeTests();
  });

  describe("Given that I wish to delet an existing hike in database", () => {
    describe("When I DELETE on /hike/:hikeId With the id of the existing hike", () => {
      it("Then I receive success and the hike is removed from database", async () => {
        const answer = await supertest(app)
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

        const hikesInDatabase = await HikeModel.find();
        expect(hikesInDatabase.length).toEqual(0);
      });
    });
  });
});
