import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import routes from "./routes/index.js";
import { fileDir } from "./utils/tools.cjs";
import { scheduleJob } from "node-schedule";
import cluster from "node:cluster";
import { availableParallelism } from "node:os";
import passport from "passport";
import "./middleware/private.js";

const totalCPU = availableParallelism();

if (cluster.isMaster) {
  for (let i = 0; i < totalCPU; i++) {
    cluster.fork();

    if (i === 1) {
      scheduleJob("0 1 * * *", async function () {});
    }
  }
} else {
  startExpress();
}

function startExpress() {
  dotenv.config();
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS,
      credentials: true,
    })
  );
  app.use(express.static(fileDir()));
  app.use(express.json());
  app.use(passport.initialize());
  app.use(routes);

  app.listen(process.env.APP_PORT, () => {
    console.log(
      `⚡️[server]: Server is running at http://localhost:${process.env.APP_PORT}`
    );
  });
}
