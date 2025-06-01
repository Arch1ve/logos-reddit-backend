import express, { Request, Response } from 'express';
import * as mongoose from "mongoose";
import Post from "./models/post";
import Comment from "./models/comment";
import { DATABASE_URL, PORT } from './config';
import {createUser, getCurrentUser, login} from "./controllers/users";
import auth from "./middlewares/auth";
import SessionRequest from "./types/sessionRequest";
import cors from "cors";
import path from 'path';

mongoose.connect(DATABASE_URL || "");
const app = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/user/register", createUser)
app.post("/api/user/login", login)

app.get("/api/posts", (req: Request, res: Response) => {
   Post.find({})
   .populate("author")
   .then((posts) => {
      res.send(posts)
   })
   .catch((err) => {
    return res.status(500).send("Ошибка сервера");
   })
 })

app.get("/api/post/:id", (req: Request, res: Response) => {
  const postId = req.params.id;

  Post.findById(postId)
    .populate('comments')
    .then((post) => {
      if (!post) {
        return res.status(404).send("Пост не найден");
      }
      res.send(post);
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send("Ошибка сервера");
    })
})

// AUTH MIDDLEWARE
app.use(auth)

app.get("/api/user/me", getCurrentUser)

app.post("/api/post/create", (req: SessionRequest, res: Response) => {
  // @ts-ignore
  const userId = req.user._id;
  const { title, description, shortDescription} = req.body

  Post.create({ author: userId, title, description, shortDescription })
    .then((post) => {
      res.send(post)
    })
    .catch((err) => {
      res.status(403).send("Переданы некорректные данные")
    })
})

app.post("/api/comment/create/:postId", (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user._id;
  const postId = req.params.postId;
  
  const { description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).send("Неверный ID поста");
  }
  Comment.create({ author: userId, description })
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
          //Comment.deleteOne({ _id: comment._id }).exec();
          res.status(500).send("Ошибка при обновлении поста");
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send(err);
    });
});

app.use(express.static(path.join(__dirname, '../logos-reddit/dist')));

app.get('*', (req, res) => { 
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../logos-reddit/dist', 'index.html'));
  } else {
    res.status(404).json({ message: 'API route not found' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});



