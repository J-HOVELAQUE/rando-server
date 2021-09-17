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

  describe("POST /place", () => {
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

  describe("GET /place", () => {
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

  describe("/PUT/:placeId", () => {
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
