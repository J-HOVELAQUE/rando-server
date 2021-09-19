import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose } from "mongoose";
import PlaceModel from "../model/PlaceModel";
import supertest from "supertest";

describe("PUT /place/:placeId/location", () => {
  let database: Mongoose;
  const app = buildServer();
  let placeInDatabaseId: string;

  beforeAll(async () => {
    database = await createConnection();
  });

  afterAll(async () => {
    await database.connection.close();
  });

  beforeEach(async () => {
    await PlaceModel.deleteMany();
    const firstPlace = new PlaceModel({
      name: "Pointe de Chalune",
      mountainLocation: "Chablais",
      altitudeInMeters: 2030,
    });

    const placeInDatabase = await firstPlace.save();
    placeInDatabaseId = placeInDatabase.id;
  });

  afterEach(async () => {
    await PlaceModel.deleteMany();
  });

  describe("Given that I wish to change the location of a place", () => {
    describe("When I PUT on /place/:placeId/location with valid payload and id", () => {
      it("Then I receive success and the place is updated", async () => {
        const answer = await supertest(app)
          .put("/place/" + placeInDatabaseId + "/location")
          .send({
            lat: 12.34,
            long: 34.7655,
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

        const placeInDatabaseUpdated = await PlaceModel.findById(
          placeInDatabaseId
        );

        expect(placeInDatabaseUpdated).not.toBeNull();

        if (placeInDatabaseUpdated) {
          expect(placeInDatabaseUpdated.location.type).toBe("Point");
          expect(placeInDatabaseUpdated.location.coordinates[0]).toBe(12.34);
          expect(placeInDatabaseUpdated.location.coordinates[1]).toBe(34.7655);
        }
      });
    });
  });
});
