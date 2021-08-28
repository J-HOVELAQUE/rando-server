import mongoose, { Mongoose } from "mongoose";
import config from "config";

const uriConnection: string = config.get("mongodb.uriConnection");

const option = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export default async function createConnection(): Promise<Mongoose> {
  try {
    const connection = mongoose.connect(uriConnection, option);
    console.log(`*** Database connection to ${uriConnection} created ***`);
    return connection;
  } catch (err) {
    console.log("ERROR during database connection", err);
    throw err;
  }
}
