import server from "./server";
import initRepository from "./initRepository";
import createConnection from "./createDatabaseConnection";

createConnection();

const app = server(initRepository());

app.start();
