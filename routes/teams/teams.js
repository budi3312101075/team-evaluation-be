import express from "express";
import {
  addTeams,
  getAll,
  validationAddTeams,
  teams,
} from "../../controllers/teams/team.js";

const router = express.Router();

router.get("/teams-all", getAll);
router.get("/teams", teams);
router.post("/teams", validationAddTeams, addTeams);

export default router;
