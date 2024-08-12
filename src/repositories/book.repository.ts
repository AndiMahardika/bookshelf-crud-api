import { Book } from "../models/book.schema";
import { IBook } from "../types/entity";

const BookRepository = {
  getAll: async () => {
    const allBook = await Book.find().populate('userId');
    return allBook;
  },

  getBookByUserId: async (id: string) => {
    const userId = id;
    const books = await Book.find({userId}).populate('userId');
    return books
  },

  createBook: async (bookData: IBook) => {
    const newBook = new Book(bookData);

    const savedBook = await newBook.save();
    return savedBook;
  },

  updateBook: async (id: string, bookData: IBook) => {
    const bookId = id;
    const {title, author, description, isDone} = bookData;
    const updatedBook = await Book.findByIdAndUpdate(
      {_id: bookId} ,
      {title, author, description, isDone}, 
      { new: true }
    );
    return updatedBook;
  },

  deleteBook: async (id: string) => {
    const bookId = id;
    await Book.findByIdAndDelete(bookId);
  }
};

export default BookRepository;