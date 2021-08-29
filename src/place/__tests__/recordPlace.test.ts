import createConnection from "../../createDatabaseConnection";
import buildServer, { Server } from "../../server";
import { Mongoose } from "mongoose";
import PlaceModel from "../model/PlaceModel";
import supertest from "supertest";

describe("POST /place", () => {
  let database: Mongoose;
  const app = buildServer();

  beforeEach(async () => {
    database = await createConnection();
    await PlaceModel.deleteMany();
  });

  afterEach(async () => {
    await PlaceModel.deleteMany();
    await database.connection.close();
  });

  describe("Given that I wish to record a new place without picture", () => {
    describe("When I send a valid payload to the create place route", () => {
      test("Then I receive a succes and there is a new place in database", async () => {
        const answer = await supertest(app)
          .post("/place")
          .send({
            name: "Pointe de Chalune",
            mountainLocation: "Chablais",
            altitudeInMeters: 2030,
          })
          .set("Accept", "application/json")
          .expect(201);

        expect(answer.body).toEqual({
          message: "place Pointe de Chalune recorded",
          place: {
            __v: 0,
            _id: expect.any(String),
            altitudeInMeters: 2030,
            mountainLocation: "Chablais",
            name: "Pointe de Chalune",
          },
        });

        const placeInDatabase = await PlaceModel.find();
        // expect(placeInDatabase).toEqual([
        //   {
        //     __v: 0,
        //     _id: expect.anything(),
        //     altitudeInMeters: 2030,
        //     mountainLocation: "Chablais",
        //     name: "Pointe de Chalune",
        //   },
        // ]);
      });
    });
  });

  describe("Given that I try to record a new place with invalid payload", () => {
    describe("When I send an invalit payload on the route", () => {
      it("Then I received an invalid payload error and the database is empty", async () => {
        const answer = await supertest(app)
          .post("/place")
          .send({
            name: "Pointe de Chalune",
            mountainLocation: 12,
          })
          .set("Accept", "application/json")
          .expect(400);

        expect(answer.body).toEqual({
          details: [
            '"mountainLocation" must be a string',
            '"altitudeInMeters" is required',
          ],
          error: "payloadError",
        });

        const placeInDatabase = await PlaceModel.find();

        expect(placeInDatabase).toEqual([]);
      });
    });
  });
});
