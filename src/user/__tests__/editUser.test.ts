import createConnection from "../../createDatabaseConnection";
import buildServer from "../../server";
import { Mongoose } from "mongoose";
import supertest from "supertest";
import UserModel from "../model/UserModel";

describe("PUT /user/:userId", () => {
  let database: Mongoose;
  const app = buildServer();
  let userIdAlreadyInDatabase: string;

  beforeAll(async () => {
    database = await createConnection();
  });

  afterAll(async () => {
    await database.connection.close();
  });

  beforeEach(async () => {
    await UserModel.deleteMany();
    const userAlreadyInDatabase = new UserModel({
      name: "Lharicot",
      firstname: "Toto",
      email: "tot.lhar@gmail.fr",
      dateOfBirth: "1978-04-12",
    });

    const saveResult = await userAlreadyInDatabase.save();
    userIdAlreadyInDatabase = saveResult.id;
  });

  afterEach(async () => {
    await UserModel.deleteMany();
  });

  describe("Given that I wish to update user data for a user in db", () => {
    describe("When I PUT valid payload on valid id on /user/:userId", () => {
      it("Then I receive success on the user is updated", async () => {
        const answer = await supertest(app)
          .put("/user/" + userIdAlreadyInDatabase)
          .send({
            name: "Dupond",
            firstname: "Toto",
            email: "tot.lhar@gmail.com",
            dateOfBirth: "1979-12-12",
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

        const updatedUser = await UserModel.findById(userIdAlreadyInDatabase);
        expect(updatedUser).not.toBeNull();

        if (updatedUser) {
          expect(updatedUser.name).toBe("Dupond");
          expect(updatedUser.firstname).toBe("Toto");
          expect(updatedUser.email).toBe("tot.lhar@gmail.com");
          expect(updatedUser.dateOfBirth).toEqual(new Date("1979-12-12"));
        }
      });
    });
  });

  describe("Given that I try to update a user with invalid payload", () => {
    describe("When I PUT invalid payload on /user/userId", () => {
      it("It return failure and user isn't updated", async () => {
        const answer = await supertest(app)
          .put("/user/" + userIdAlreadyInDatabase)
          .send({
            name: "Dupond",
            firstname: "Toto",
            email: "tot.lhar@gmail",
            dateOfBirth: "1979-12-12",
          })
          .set("Accept", "application/json")
          .expect(400);

        expect(answer.body).toEqual({
          details: ['"email" must be a valid email'],
          error: "payloadError",
        });

        const updatedUser = await UserModel.findById(userIdAlreadyInDatabase);
        expect(updatedUser).not.toBeNull();

        if (updatedUser) {
          expect(updatedUser.name).toBe("Lharicot");
          expect(updatedUser.firstname).toBe("Toto");
          expect(updatedUser.email).toBe("tot.lhar@gmail.fr");
          expect(updatedUser.dateOfBirth).toEqual(new Date("1978-04-12"));
        }
      });
    });
  });
});
