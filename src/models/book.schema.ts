import { model, Schema } from "mongoose";

const bookSchema = new Schema({
  title: { type: String },
  author: { type: String },
  description: { type: String },
  isDone: { type: Boolean },
  userId: {type: Schema.Types.ObjectId, ref: 'User'}
});

export const Book = model("Book", bookSchema)