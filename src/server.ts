const express = require("express");

interface Server {
  start: () => void;
}

export default function server(): Server {
  return {
    start: () => {
      const app = express();

      app.get("/", function (req, res) {
        res.json({ message: "coucou" });
      });

      app.listen(3000, function () {
        console.log("Serveur démarré");
      });
    },
  };
}
