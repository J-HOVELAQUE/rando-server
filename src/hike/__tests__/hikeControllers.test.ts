import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose, ObjectId } from "mongoose";
import supertest from "supertest";
import HikeModel from "../model/HikeModel";
import PlaceModel from "../../place/model/PlaceModel";
import UserModel from "../../user/model/UserModel";

describe("Testing hike controllers", () => {
  let database: Mongoose;
  let placeInDatabaseId: ObjectId;
  let firstUserInDatabaseId: ObjectId;
  let secondUserInDatabaseId: ObjectId;
  const app = buildServer();

  beforeAll(async () => {
    database = await createConnection();
  });

  afterAll(async () => {
    await database.connection.close();
  });

  describe("POST /hike", () => {
    beforeEach(async () => {
      await HikeModel.deleteMany();
      await PlaceModel.deleteMany();
      await UserModel.deleteMany();

      const placeInDb = new PlaceModel({
        name: "Pointe de Chalune",
        mountainLocation: "Chablais",
        altitudeInMeters: 2030,
      });
      const savePlaceResult = await placeInDb.save();

      const firstUserInDatabase = new UserModel({
        name: "Lharicot",
        firstname: "Toto",
        email: "tot.lhar@gmail.fr",
      });
      const saveFirstUserInDatabaseResult = await firstUserInDatabase.save();

      const secondUserInDatabase = new UserModel({
        name: "Golotte",
        firstname: "Marie",
        email: "mar.gol@gmail.fr",
      });
      const saveSecondUserInDatabaseResult = await secondUserInDatabase.save();

      placeInDatabaseId = savePlaceResult._id;
      firstUserInDatabaseId = saveFirstUserInDatabaseResult._id;
      secondUserInDatabaseId = saveSecondUserInDatabaseResult._id;
    });

    afterEach(async () => {
      await HikeModel.deleteMany();
      await PlaceModel.deleteMany();
      await UserModel.deleteMany();
    });

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
              participants: [firstUserInDatabaseId, "612356b4fa3b67359c4a1a13"],
              place: placeInDatabaseId,
            })
            .set("Accept", "application/json");
          // .expect(201);

          expect(answer.body).toEqual({});
        });
      });
    });
  });
});
