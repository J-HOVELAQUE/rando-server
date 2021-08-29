import mongoose, { Mongoose } from "mongoose";
import config from "config";

const option = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export default async function createConnection(): Promise<Mongoose> {
  let uriConnection: string = config.get("mongodb.uriConnection");

  if (config.get("environment") === "prod") {
    uriConnection = `mongodb+srv://${config.get("mongodb.user")}:${config.get(
      "mongodb.password"
    )}@lacapsule.fd7ap.mongodb.net/${config.get(
      "mongodb.dbName"
    )}?retryWrites=true&w=majority`;
  }
  try {
    const connection = mongoose.connect(uriConnection, option);
    console.log(`*** Database connection to ${uriConnection} created ***`);
    return connection;
  } catch (err) {
    console.log("ERROR during database connection", err);
    throw err;
  }
}
