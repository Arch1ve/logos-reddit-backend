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
   const {author, title, description, shortDescription} = req.body

   Post.create({ author, title, description, shortDescription })
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

app.post("/comment/create/:postId", (req: Request, res: Response) => {
  const { author, description, likes, totallikes, createdAt } = req.body;
  const postId = req.params.postId;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).send("Неверный ID поста");
  }

  Comment.create({ author, description, likes, totallikes, createdAt })
    .then((comment) => {
      Post.findByIdAndUpdate(
        postId,
        { $push: { comments: comment._id } },
        { new: true }
      )
        .then((post) => {
          if (!post) {
            Comment.deleteOne({ _id: comment._id }).exec();
            return res.status(404).send("Пост не найден");
          }
          res.send(comment);
        })
        .catch((err) => {
          console.log(err);
          Comment.deleteOne({ _id: comment._id }).exec();
          res.status(500).send("Ошибка при обновлении поста");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

app.use((req: Request, res: Response) => res.status(404).send("Страница не найдена"));


app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
