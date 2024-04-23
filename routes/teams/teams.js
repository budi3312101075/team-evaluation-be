import express from "express";
import { getTeams } from "../../controllers/teams/team.js";

const router = express.Router();

router.get("/teams", getTeams);

export default router;
