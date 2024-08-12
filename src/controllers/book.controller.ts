import { Request, Response } from "express";
import BookService from "../services/book.services";
import jwt from "jsonwebtoken";

const BookController = {
  handleGetAll: async (req: Request, res: Response) => {
    try {
      const allBook = await BookService.getAll();
      return res.status(200).json({message: "success get all book" , data: allBook});
    } catch (error) {
      console.log(error);
    }
  },

  handleGetBookByUserId: async (req: Request, res: Response) => {
    try {
      const {accessToken} = req.cookies;
      // console.log(accessToken);

      const payload = jwt.decode(accessToken) as { id: string; name: string; email: string } ;
      // console.log(user);
      
      const books = await BookService.getBookByUserId(payload.id);
      return res.status(200).json({message: "success get book by user id" , data: books});
      } catch (error) {
      console.log(error);
    }
  },

  handleCreateBook: async (req: Request, res: Response) => {
    try {
      const {accessToken} = req.cookies

      const payload = jwt.decode(accessToken) as { id: string; name: string; email: string } ;
      const userId = payload.id

      const {title, author, description, isDone} = req.body;

      const newBook = await BookService.createBook({title, author, description, isDone, userId});
      return res.status(201).json({message: "success create book" , data: newBook});
    } catch (error) {
      console.log(error);
    }
  },

  handleUpdateBook: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const {title, author, description, isDone, userId} = req.body;
      const updatedBook = await BookService.updateBook(id, {title, author, description, isDone, userId});
      return res.status(200).json({message: "success update book" , data: updatedBook});
    } catch (error) {
      console.log(error);
    }
  },

  handleDeleteBook: async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      await BookService.deleteBook(id);
      return res.status(200).json({message: "success delete book"});
    } catch (error) {
      console.log(error);
    }
  }
}

export default BookController;