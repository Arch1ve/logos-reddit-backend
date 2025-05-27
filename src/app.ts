import express, { Request, Response } from 'express';
import * as mongoose from "mongoose";
import User from "./models/user";
import Post from "./models/post";
import Comment from "./models/comment";

mongoose.connect("mongodb://localhost:27017/logos");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Работает")
})

 app.post("/user/create", (req: Request, res: Response) => {
   const {email, password, username} = req.body

   User.create({ email, password, username })
     .then((user) => {
       res.send(user)
     })
     .catch((err) => {
       console.log(err);
       res.status(403).send()
     })
 })

 app.get("/users", (req: Request, res: Response) => {
   User.find({})
   .then((users) => {
      res.send(users)
   })
   .catch((err) => {
       console.log(err);
       res.status(403).send()
     })
 })

 app.post("/post/create", (req: Request, res: Response) => {
   const {author, title, description, shortDescription, likes, totallikes, createdAt} = req.body

   Post.create({ author, title, description, shortDescription, likes, totallikes, createdAt })
     .then((post) => {
       res.send(post)
     })
     .catch((err) => {
       console.log(err);
       res.status(403).send()
     })
 })

 app.get("/posts", (req: Request, res: Response) => {
   Post.find({})
   .then((posts) => {
      res.send(posts)
   })
   .catch((err) => {
       console.log(err);
       res.status(403).send()
     })
 })

 app.post("/comment/create", (req: Request, res: Response) => {
   const {author, description, likes, totallikes, createdAt} = req.body

   Comment.create({ author, description, likes, totallikes, createdAt })
     .then((comment) => {
       res.send(comment)
     })
     .catch((err) => {
       console.log(err);
       res.status(403).send()
     })
 }) 

 app.get("/comments", (req: Request, res: Response) => {
   Comment.find({})
   .then((comments) => {
      res.send(comments)
   })
   .catch((err) => {
       console.log(err);
       res.status(403).send()
     })
 })

app.use((req: Request, res: Response) => res.status(404).send("Страница не найдена"));


app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
