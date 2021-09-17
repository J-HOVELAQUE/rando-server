import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose } from "mongoose";
import PlaceModel from "../model/PlaceModel";
import HikeModel from "../../hike/model/HikeModel";
import supertest from "supertest";

describe("POST '/place'", () => {
  let database: Mongoose;
  const app = buildServer();

  beforeAll(async () => {
    database = await createConnection();
  });

  afterAll(async () => {
    await database.connection.close();
  });

  beforeEach(async () => {
    await PlaceModel.deleteMany();
  });

  afterEach(async () => {
    await PlaceModel.deleteMany();
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
            location: {
              coordinates: [],
            },
          },
        });

        const placesInDatabase = await PlaceModel.find();

        expect(placesInDatabase.length).toBe(1);
        const placeInDatabase = placesInDatabase[0];

        expect(placeInDatabase.altitudeInMeters).toBe(2030);
        expect(placeInDatabase.mountainLocation).toBe("Chablais");
        expect(placeInDatabase.name).toBe("Pointe de Chalune");
        expect(placeInDatabase.__v).toBe(0);
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

  describe("Given that I try to record a new place with a name already in db", () => {
    describe("When I send a place with an existing name on the route", () => {
      it("Then I receive a status 409 and the place isn't recorded", async () => {
        const placeInDb = new PlaceModel({
          name: "Pointe de Chalune",
          mountainLocation: "Chablais",
          altitudeInMeters: 2030,
        });

        await placeInDb.save();

        const answer = await supertest(app)
          .post("/place")
          .send({
            name: "Pointe de Chalune",
            mountainLocation: "Chablais",
            altitudeInMeters: 2030,
          })
          .set("Accept", "application/json")
          .expect(409);

        expect(answer.body).toEqual({
          error: "uniqueIndexError",
          message: "a place with this name already existing",
        });
      });
    });
  });
});
