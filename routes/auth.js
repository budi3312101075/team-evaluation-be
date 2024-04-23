import express from "express";
import { validateLogin, login, resetPassword } from "../controllers/auth.js";
import passport from "passport";

const router = express.Router();

router.post("/login", validateLogin, login);
router.put(
  "/reset-password",
  passport.authenticate("internal-rule", { session: false }),
  resetPassword
);

export default router;
