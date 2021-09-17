import HikeModel from "../../hike/model/HikeModel";
import PlaceModel from "../../place/model/PlaceModel";
import UserModel from "../../user/model/UserModel";

export default async function teardownPlaceTests() {
  await HikeModel.deleteMany();
  await PlaceModel.deleteMany();
  await UserModel.deleteMany();
}
