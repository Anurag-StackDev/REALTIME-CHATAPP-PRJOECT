import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./database/db.js";
import authRoute from "./routes/auth.route.js";
import chatRoute from "./routes/chat.route.js";
import cors from "cors";
import { app, server } from "./lib/socket.js";

import path from "path";

dotenv.config();

const PORT = process.env.PORT || 4555;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

//Routes
app.use("/API/auth", authRoute);
app.use("/API/chat", chatRoute);

//Server Live
server.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on PORT: ${PORT}`);
});
