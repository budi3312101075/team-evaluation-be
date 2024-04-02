import express from "express";
import {
  login,
  logout,
  registerTeam,
  registerUser,
} from "../controllers/auth.js";
import multerTeam from "../middleware/multerTeam.js";
import { privateRoutes } from "../middleware/private.js";

const router = express.Router();

router.post("/register-team", privateRoutes, multerTeam, registerTeam);
router.post("/register-user", privateRoutes, registerUser);
router.post("/login", login);
router.get("/logout", logout);

export default router;
