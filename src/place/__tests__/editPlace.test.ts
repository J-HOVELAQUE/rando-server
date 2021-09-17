import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose } from "mongoose";
import PlaceModel from "../model/PlaceModel";
import HikeModel from "../../hike/model/HikeModel";
import supertest from "supertest";

describe("PUT '/:placeId'", () => {
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
    placeInDatabaseId = placeInDatabase._id;
  });

  afterEach(async () => {
    await PlaceModel.deleteMany();
  });
  describe("Given that I wish to update a place in database", () => {
    describe("When I PUT a valid payload and existing id as params on /place", () => {
      it("Then I receive a success and the document is updated", async () => {
        const answer = await supertest(app)
          .put("/place/" + placeInDatabaseId)
          .send({
            name: "Pointe de Marcelly",
            altitudeInMeters: 1200,
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

        const updatedDocument = await PlaceModel.findById(placeInDatabaseId);
        expect(updatedDocument).not.toBeNull();

        if (updatedDocument) {
          expect(updatedDocument.altitudeInMeters).toBe(1200);
          expect(updatedDocument.mountainLocation).toBe("Chablais");
          expect(updatedDocument.name).toBe("Pointe de Marcelly");
        }
      });
    });
  });

  describe("Given that I try tu update a Place in db with invalid payload", () => {
    describe("When I PUT an invalid payload on /place/:placeId", () => {
      it("Then I receive a failure and the place isn't updated", async () => {
        const answer = await supertest(app)
          .put("/place/" + placeInDatabaseId)
          .send({
            named: "Pointe de Marcelly",
            altitudeInMeters: "mille",
          })
          .set("Accept", "application/json")
          .expect(400);

        expect(answer.body).toEqual({
          details: [
            '"altitudeInMeters" must be a number',
            '"named" is not allowed',
          ],
          error: "payloadError",
        });

        const updatedDocument = await PlaceModel.findById(placeInDatabaseId);
        expect(updatedDocument).not.toBeNull();

        if (updatedDocument) {
          expect(updatedDocument.altitudeInMeters).toBe(2030);
          expect(updatedDocument.mountainLocation).toBe("Chablais");
          expect(updatedDocument.name).toBe("Pointe de Chalune");
        }
      });
    });
  });

  describe("Given that I try tu update a Place with invalid id", () => {
    describe("When I give an invalid params to PUT /place/:placeId", () => {
      it("I receive a failure", async () => {
        const answer = await supertest(app)
          .put("/place/61236a11058423084474c16")
          .send({
            name: "Pointe de Marcelly",
            altitudeInMeters: 1200,
          })
          .set("Accept", "application/json")
          .expect(400);

        expect(answer.body).toEqual({
          error: "cast error",
          details: "invalid id",
        });
      });
    });
  });

  describe("Given that I wish to update an inexisting place", () => {
    describe("When I give an inexisting id as params", () => {
      it("Then I receive a success with ", async () => {
        const answer = await supertest(app)
          .put("/place/61236a11058423084474c161")
          .send({
            name: "Pointe de Marcelly",
            altitudeInMeters: 1200,
          })
          .set("Accept", "application/json")
          .expect(200);

        expect(answer.body).toEqual({
          message: "no document found or no change from old data",
          result: {
            n: 0,
            nModified: 0,
            ok: 1,
          },
        });
      });
    });
  });
});
