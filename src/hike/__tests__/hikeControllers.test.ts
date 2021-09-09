import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose, ObjectId } from "mongoose";
import supertest from "supertest";
import HikeModel from "../model/HikeModel";
import PlaceModel from "../../place/model/PlaceModel";
import UserModel from "../../user/model/UserModel";
import setupHikeTest from "./setupHikeTests";
import teardownHikeTests from "./teardownHikeTests";

describe("Testing hike controllers", () => {
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
  });

  afterEach(async () => {
    await teardownHikeTests();
  });

  describe("POST /hike", () => {
    describe("Given that I wish to record an hike with valid payload, place and participants", () => {
      describe("When I POST the valid payload to /hike", () => {
        it("Then I receive the success and 201 and the hike is recorded in database", async () => {
          const answer = await supertest(app)
            .post("/hike")
            .send({
              durationInMinutes: 120,
              elevationInMeters: 900,
              distanceInMeters: 6000,
              startingAltitude: 1000,
              arrivalAltitude: 1900,
              description: "Très belle randonnée.",
              date: "2021-12-03",
              participants: [firstUserInDatabaseId, secondUserInDatabaseId],
              place: placeInDatabaseId,
            })
            .set("Accept", "application/json")
            .expect(201);

          expect(answer.body).toEqual({
            message: "hike recorded",
            hike: {
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
          });

          const hikesInDatabase = await HikeModel.find();
          expect(hikesInDatabase.length).toBe(1);
          expect(hikesInDatabase[0].durationInMinutes).toBe(120);
          expect(hikesInDatabase[0].arrivalAltitude).toBe(1900);
          expect(hikesInDatabase[0].date).toEqual(expect.any(Date));
          expect(hikesInDatabase[0].distanceInMeters).toBe(6000);
          expect(hikesInDatabase[0].elevationInMeters).toBe(900);
          expect(hikesInDatabase[0].startingAltitude).toBe(1000);
        });
      });
    });

    describe("Given that I try to record a new hike with invalid payload", () => {
      describe("When I POST an invalid paload on /hike", () => {
        it("Then I receive a failure and there is no hike in database", async () => {
          const answer = await supertest(app)
            .post("/hike")
            .send({
              durationInMinutes: 120,
              distanceInMeters: 6000,
              startingAltitude: "mille",
              arrivalAltitude: 1900,
              description: "Très belle randonnée.",
              date: "date",
              participants: [firstUserInDatabaseId, secondUserInDatabaseId],
              place: placeInDatabaseId,
            })
            .set("Accept", "application/json")
            .expect(400);

          expect(answer.body).toEqual({
            error: "payloadError",
            details: [
              '"elevationInMeters" is required',
              '"startingAltitude" must be a number',
              '"date" must be a valid date',
            ],
          });

          const hikesInDatabase = await HikeModel.find();
          expect(hikesInDatabase.length).toBe(0);
        });
      });
    });

    describe("Given that I try to record a new hike with an inexisting place id", () => {
      describe("When I POST a payload with inexisting place on /hike", () => {
        it("Then I receive a failure and there is no hike in database", async () => {
          const answer = await supertest(app)
            .post("/hike")
            .send({
              durationInMinutes: 120,
              elevationInMeters: 900,
              distanceInMeters: 6000,
              startingAltitude: 1000,
              arrivalAltitude: 1900,
              description: "Très belle randonnée.",
              date: "2021-12-03",
              participants: [firstUserInDatabaseId, secondUserInDatabaseId],
              place: "61236a11058423084474c166",
            })
            .set("Accept", "application/json")
            .expect(409);

          expect(answer.body).toEqual({
            error: "database error",
            details: "no place with this id in database",
          });

          const hikesInDatabase = await HikeModel.find();
          expect(hikesInDatabase.length).toBe(0);
        });
      });
    });

    describe("Given that I try to record a new hike with an inexisting user id", () => {
      describe("When I POST a payload with inexisting user on /hike", () => {
        it("Then I receive a failure and there is no hike in database", async () => {
          const answer = await supertest(app)
            .post("/hike")
            .send({
              durationInMinutes: 120,
              elevationInMeters: 900,
              distanceInMeters: 6000,
              startingAltitude: 1000,
              arrivalAltitude: 1900,
              description: "Très belle randonnée.",
              date: "2021-12-03",
              participants: [firstUserInDatabaseId, "61236a11058423084474c166"],
              place: placeInDatabaseId,
            })
            .set("Accept", "application/json")
            .expect(409);

          expect(answer.body).toEqual({
            error: "database error",
            details: "no participant with this id in database",
          });

          const hikesInDatabase = await HikeModel.find();
          expect(hikesInDatabase.length).toBe(0);
        });
      });
    });
  });

  describe("GET /hike", () => {
    let hikeIdInDatabase: string;

    beforeEach(async () => {
      await HikeModel.deleteMany();
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
      await HikeModel.deleteMany();
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
              place: expect.any(String),
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

  describe("PUT /hike/:hikeId", () => {
    let hikeIdInDatabase: string;
    let hikeObjectIdInDatabase: ObjectId;

    beforeEach(async () => {
      await HikeModel.deleteMany();
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
      await HikeModel.deleteMany();
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
});
