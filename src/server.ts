import expres from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import bookRoute from "./routes/book.route"
import cookieParser from "cookie-parser"
import authRoute from "./routes/auth.route"
import authMiddleware from "./middleware/auth.middleware"

dotenv.config()
const app = expres()
app.use(expres.json())
app.use(cookieParser())

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log(error);
    console.log("MongoDB not connected");
  });

app.get("/", authMiddleware, (req, res) => {
  return res.json({message: "ini datanya"})
})

app.use("/bookshelf/api/v1/", authRoute)
app.use("/bookshelf/api/v1/book", bookRoute)

app.listen(process.env.PORT, () => {
  console.log(`Server running at port, ${process.env.PORT}`)
})