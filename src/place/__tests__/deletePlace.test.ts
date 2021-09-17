import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose } from "mongoose";
import PlaceModel from "../model/PlaceModel";
import HikeModel from "../../hike/model/HikeModel";
import supertest from "supertest";

describe("Testing place controlers", () => {
  let database: Mongoose;
  const app = buildServer();

  beforeAll(async () => {
    database = await createConnection();
  });

  afterAll(async () => {
    await database.connection.close();
  });

  describe("DELETE /place/:placeId", () => {
    let placeInDatabaseId: string;

    beforeEach(async () => {
      await PlaceModel.deleteMany();
      const firstPlace = new PlaceModel({
        name: "Pointe de Chalune",
        mountainLocation: "Chablais",
        altitudeInMeters: 2030,
      });

      const placeInDatabase = await firstPlace.save();
      placeInDatabaseId = placeInDatabase._id;
    });

    afterEach(async () => {
      await PlaceModel.deleteMany();
    });

    describe("Given that I want to delete a place in database", () => {
      describe("When I send a DELETE on /place route with the id of a place without hike", () => {
        it("It return success and the place is deleted", async () => {
          const answer = await supertest(app)
            .delete("/place/" + placeInDatabaseId)
            .set("Accept", "application/json")
            .expect(200);

          expect(answer.body).toEqual({
            message: "place deleted",
            result: {
              deletedCount: 1,
              n: 1,
              ok: 1,
            },
          });

          const placeInDatabase = await PlaceModel.find();
          expect(placeInDatabase.length).toBe(0);
        });
      });
    });

    describe("Given that I try to delete a place with hike", () => {
      describe("When I cast DELETE on /place with the id of a place with hike", () => {
        it("Then I receive failure and the place isn't deleted", async () => {
          const hikeInDatabase = new HikeModel({
            date: "2021-12-03",
            durationInMinutes: 1200,
            elevationInMeters: 300,
            distanceInMeters: 1500,
            startingAltitude: 1000,
            arrivalAltitude: 1300,
            place: placeInDatabaseId,
          });
          await hikeInDatabase.save();

          const answer = await supertest(app)
            .delete("/place/" + placeInDatabaseId)
            .set("Accept", "application/json")
            .expect(400);

          expect(answer.body).toEqual({
            message: "Deletion failed",
            reason: "There is one or more hike in this place",
          });

          const placeInDatabase = await PlaceModel.findById(placeInDatabaseId);
          expect(placeInDatabase).not.toBeNull;

          if (placeInDatabase) {
            expect(placeInDatabase.name).toBe("Pointe de Chalune");
          }
        });
      });
    });

    describe("Given that I try to delete a place that doesn't exist in database", () => {
      describe("When I send an inexisting id to DELETE /place", () => {
        it("Then I receive succes with deletion result", async () => {
          const answer = await supertest(app)
            .delete("/place/612356a8fa3b67359c4a1a0f")
            .set("Accept", "application/json")
            .expect(200);

          expect(answer.body).toEqual({
            message: "place deleted",
            result: {
              deletedCount: 0,
              n: 0,
              ok: 1,
            },
          });
        });
      });
    });
  });
});
