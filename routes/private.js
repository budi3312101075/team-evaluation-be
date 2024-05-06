import express from "express";
import teams from "./teams/teams.js";

const app = express();

app.use(teams);

export default app;
