import express from "express";
import { created, deleted, update } from "../../controllers/teams/leader.js";

const router = express.Router();

router.post("/leader", created);
router.patch("/leader/:id", update);
router.delete("/leader/:id", deleted);

export default router;
