import buildPlaceRepository from "./place/repository/buildPlaceRepository";

export default function initRepository() {
  const placeRepository = buildPlaceRepository();
  console.log("*** Repository initialised");

  return {
    placeRepository,
  };
}
