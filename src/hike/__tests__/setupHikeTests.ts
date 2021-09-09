import HikeModel from "../model/HikeModel";
import PlaceModel from "../../place/model/PlaceModel";
import UserModel from "../../user/model/UserModel";
import { ObjectId } from "mongoose";

interface SetupResult {
  placeInDatabaseId: string;
  firstUserInDatabaseId: ObjectId;
  secondUserInDatabaseId: ObjectId;
}

export default async function setupHikeTests(): Promise<SetupResult> {
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

  return {
    placeInDatabaseId: savePlaceResult.id,
    firstUserInDatabaseId: saveFirstUserInDatabaseResult._id,
    secondUserInDatabaseId: saveSecondUserInDatabaseResult._id,
  };
}
