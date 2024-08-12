import { ObjectId } from "mongoose";

export interface IUser{
  name: string;
  email: string;
  password: string;
}

export interface IBook{
  title: string;
  author: string;
  description: string;
  isDone: boolean;
  userId: string;
}