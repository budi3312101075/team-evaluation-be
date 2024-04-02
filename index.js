import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.js";
import { fileDir } from "./utils/tools.cjs";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);
app.use(express.static(fileDir()));

app.use(cookieParser());
app.use(express.json());
app.use(authRoutes);

app.listen(process.env.APP_PORT, () => {
  console.log(`http://localhost:${process.env.APP_PORT}`);
});
