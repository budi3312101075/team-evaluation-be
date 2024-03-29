import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: process.env.CORS,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.listen(process.env.PORT, () => {
  console.log(`http://localhost:${process.env.APP_PORT}`);
});
