import express from "express";
import passport from "passport";

import privateRoute from "./private.js";

const app = express();

const api = "/api/v1/teams";

app.use(
  api,
  passport.authenticate("internal-rule", { session: false }),
  privateRoute
);

export default app;
