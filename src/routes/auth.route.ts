import express from "express";
import UserController from "../controllers/auth.controller";
import authMiddleware from "../middleware/auth.middleware";

const authRoute = express.Router();

authRoute.get("/get-all-users", UserController.handleGetAll)

authRoute.post("/register", UserController.handleRegister)
authRoute.post("/login", UserController.handleLoginUser)
authRoute.patch("/update", authMiddleware, UserController.handleUpdateUser)
authRoute.delete("/delete-account", authMiddleware, UserController.handleDeleteUser)
authRoute.post("/logout", authMiddleware, UserController.handleLogoutUser)

export default authRoute;