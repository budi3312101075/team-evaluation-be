import express from "express";
import {
  addTeams,
  getAll,
  validationAddTeams,
  teams,
} from "../../controllers/teams/team.js";

const router = express.Router();

router.get("/teams-all", getAll); // untuk admin ambil semua data mentors
router.get("/teams", teams); // get berdasarkan siapa saja teams dari user yg login
router.post("/teams", [validationAddTeams, addTeams]);

export default router;
