import server from "./server";
import createConnection from "./createDatabaseConnection";
import config from "config";

const port: number = config.get("port");

console.log("Environment", process.env.NODE_ENV);

createConnection();

const app = server();

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
