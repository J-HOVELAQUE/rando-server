import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose } from "mongoose";
import PlaceModel from "../model/PlaceModel";
import HikeModel from "../../hike/model/HikeModel";
import supertest from "supertest";

describe("GET '/place'", () => {
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
    const firstPlace = new PlaceModel({
      name: "Pointe de Chalune",
      mountainLocation: "Chablais",
      altitudeInMeters: 2030,
    });
    const secondPlace = new PlaceModel({
      name: "Le Môle",
      mountainLocation: "Chablais",
      altitudeInMeters: 1800,
    });
    await firstPlace.save();
    await secondPlace.save();
  });

  afterEach(async () => {
    await PlaceModel.deleteMany();
  });

  describe("Given that I wish to get all places in database", () => {
    describe("When I request GET on the /place route", () => {
      it("It return 200 and places array and there is two places in db", async () => {
        const answer = await supertest(app).get("/place").expect(200);

        expect(answer.body).toEqual({
          message: "there is 2 in database",
          places: [
            {
              __v: 0,
              _id: expect.any(String),
              altitudeInMeters: 2030,
              mountainLocation: "Chablais",
              name: "Pointe de Chalune",
              location: {
                coordinates: [],
              },
            },
            {
              __v: 0,
              _id: expect.any(String),
              altitudeInMeters: 1800,
              mountainLocation: "Chablais",
              name: "Le Môle",
              location: {
                coordinates: [],
              },
            },
          ],
        });

        const firstId = answer.body.places[0]._id;
        const secondId = answer.body.places[1]._id;

        const placesInDatabase = await PlaceModel.find();
        expect(placesInDatabase.length).toBe(2);

        const firstRecordedPlace = await PlaceModel.findById(firstId);
        const secondRecordedPlace = await PlaceModel.findById(secondId);

        expect(firstRecordedPlace).not.toBeNull();
        expect(secondRecordedPlace).not.toBeNull();

        if (firstRecordedPlace && secondRecordedPlace) {
          expect(firstRecordedPlace.altitudeInMeters).toBe(2030);
          expect(firstRecordedPlace.mountainLocation).toBe("Chablais");
          expect(firstRecordedPlace.name).toBe("Pointe de Chalune");
          expect(firstRecordedPlace.__v).toBe(0);

          expect(secondRecordedPlace.altitudeInMeters).toBe(1800);
          expect(secondRecordedPlace.mountainLocation).toBe("Chablais");
          expect(secondRecordedPlace.name).toBe("Le Môle");
          expect(secondRecordedPlace.__v).toBe(0);
        }
      });
    });
  });
});
