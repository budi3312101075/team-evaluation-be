import express from "express";
import passport from "passport";
import privateRoute from "./private.js";
import authRoute from "./auth.js";

const app = express();

const api = "/api/v1";

app.use(api, authRoute);

app.use(
  api,
  passport.authenticate("internal-rule", { session: false }),
  privateRoute
);

export default app;
