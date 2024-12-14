import express from "express"
import { authenticateUser, login, logout, signup, updateProfile } from "../controller/auth.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"

const Router = express.Router()

Router.post("/signup",signup )
Router.post("/login",login )
Router.post("/logout",logout )
Router.put("/update-profile",protectRoute,updateProfile )
Router.get("/status",protectRoute,authenticateUser )



export default Router