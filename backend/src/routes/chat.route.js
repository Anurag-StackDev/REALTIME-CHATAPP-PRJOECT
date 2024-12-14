import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getChat, getContactUsers, sendMessage } from "../controller/chat.controller.js";

const Route = express.Router();

Route.get("/users", protectRoute, getContactUsers);
Route.get("/:id", protectRoute, getChat);
Route.post("/send/:id",protectRoute,sendMessage);

export default Route;
