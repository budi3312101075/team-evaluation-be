import express from "express";
import testing from "./testing.js";

const app = express();

app.use(testing);

export default app;
