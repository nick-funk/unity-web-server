import express from "express";
import { config } from "dotenv";
import nunjucks from "nunjucks";
import fetch from "node-fetch";

config();

const run = async () => {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const host = process.env.HOST_NAME ? process.env.HOST_NAME : "localhost";
  const unityServerUrl = process.env.UNITY_SERVER_URL
    ? process.env.UNITY_SERVER_URL
    : "http://localhost:7000";

  nunjucks.configure("src/server/views", { autoescape: true });

  const app = express();
  app.use(express.json());

  app.use("/script", express.static("./output/client/"));

  app.get("/", (req, res) => {
    const view = nunjucks.render("index.html", {});
    res.send(view);
  });

  // Forward commands to the Unity web server
  app.post("/api/command/*", async (req, res) => {
    try {
      const newURL = new URL(req.url, unityServerUrl).toString();

      const options = {
        method: req.method,
        body: JSON.stringify(req.body),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const unityResponse = await fetch(newURL, options);

      if (unityResponse.ok) {
        const json = await unityResponse.json();
        res.send(json);
      } else {
        res.sendStatus(500);
      }
    } catch (err) {
      console.log(err);
    }
  });

  // Forward queries to the Unity web server
  app.post("/api/query/*", async (req, res) => {
    try {
      const newURL = new URL(req.url, unityServerUrl).toString();

      const options = {
        method: req.method,
        body: JSON.stringify(req.body),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const unityResponse = await fetch(newURL, options);

      if (unityResponse.ok) {
        const json = await unityResponse.json();
        res.send(json);
      } else {
        res.sendStatus(500);
      }
    } catch (err) {
      console.log(err);
    }
  });

  app.listen(port, host, () => {
    console.log(`listening on ${host}:${port}...`);
  });
};

void run();
