import express from "express";
import BookController from "../controllers/book.controller";
import authMiddleware from "../middleware/auth.middleware";

const bookRoute = express.Router();

bookRoute.get("/", BookController.handleGetAll)
bookRoute.post("/add-book", authMiddleware, BookController.handleCreateBook)
bookRoute.patch("/:id", authMiddleware, BookController.handleUpdateBook)
bookRoute.delete("/:id", authMiddleware, BookController.handleDeleteBook)
bookRoute.get("/my-book", authMiddleware, BookController.handleGetBookByUserId)

export default bookRoute;