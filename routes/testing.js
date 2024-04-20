import express from "express";
import { getFunc } from "../controllers/testing.js";

const router = express.Router();

router.get("/testing", getFunc);

export default router;
