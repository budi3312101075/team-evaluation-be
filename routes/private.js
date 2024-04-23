import express from "express";
import teams from "./teams/teams.js";
import leader from "./teams/leader.js";

const app = express();

app.use(teams);
app.use(leader);

export default app;
