import BookRepository from "../repositories/book.repository";
import { IBook } from "../types/entity";

const BookService = {
  getAll: async () => {
    const allBook = await BookRepository.getAll();
    return allBook;
  },

  createBook: async (bookData: IBook) => {
    const newBook = await BookRepository.createBook(bookData);
    return newBook;
  },

  updateBook: async (id: string, bookData: IBook) => {
    const updatedBook = await BookRepository.updateBook(id, bookData);
    return updatedBook;
  },

  deleteBook: async (id: string) => {
    await BookRepository.deleteBook(id);
  },

  getBookByUserId: async (id: string) => {
    const books = await BookRepository.getBookByUserId(id);
    return books
  }
}

export default BookService;