import server from "./server";
import mongoose from "mongoose";

const uriConnection = "mongodb://localhost:27017/test";

const option = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const app = server();

app.start();

async function createConnection() {
  try {
    const connection = await mongoose.connect(uriConnection, option);
    console.log(`*** Database connection to  created ***`);
    return connection;
  } catch (err) {
    console.log("ERROR during database connection", err);
    throw err;
  }
}

createConnection();
