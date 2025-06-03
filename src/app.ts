import express, { Request, Response } from 'express';
import * as mongoose from "mongoose";
import Post from "./models/post";
import Comment from "./models/comment";
import { DATABASE_URL, PORT } from './config';
import {createUser, getCurrentUser, login} from "./controllers/users";
import auth from "./middlewares/auth";
import SessionRequest from "./types/sessionRequest";
import cors from "cors";
import comment from "./models/comment";
import optionalAuth from "./middlewares/optional-auth";

mongoose.connect(DATABASE_URL || "");
const app = express();

app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/user/register", createUser)
app.post("/api/user/login", login)


app.get("/api/posts", optionalAuth, async (req: SessionRequest, res: Response) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .select("_id title shortDescription fullDescription author totallikes createdAt")
      .sort({ createdAt: -1 })
      .lean();

    if (req.user && typeof req.user !== 'string') {
      const userId = req.user._id;

      const updatedPosts = posts.map(post => ({
        ...post,
        likedByCurrentUser: post.likes?.includes(userId) ?? false,
        dislikedByCurrentUser: post.dislikes?.includes(userId) ?? false,
      }));

      return res.json(updatedPosts);
    }

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера при получении постов");
  }
});

app.get("/api/post/:id",optionalAuth, (req: SessionRequest, res: Response) => {
  const postId = req.params.id;

  Post.findById(postId)
    .populate("author")
    .populate({path:"comments", populate: {path: "author", model: "user"}})
    .lean()
    .then((post) => {
      if (!post) {
        return res.status(404).send("Пост не найден");
      }
      const userId = req.user && typeof req.user !== "string" ? req.user._id.toString() : null;

      // Добавить поле likedByCurrentUser для поста
      if (userId && Array.isArray(post.likes)) {
        //@ts-ignore
        post.likedByCurrentUser = post.likes.map(id => id.toString()).includes(userId);
        //@ts-ignore
        post.dislikedByCurrentUser = post.dislikes.map(id => id.toString()).includes(userId);
      }

      // Добавить likedByCurrentUser для каждого комментария
      if (userId && Array.isArray(post.comments)) {
        post.comments = post.comments.map((comment: any) => {
          const liked = comment.likes?.map((id: any) => id.toString()).includes(userId);
          const disliked = comment.dislikes?.map((id: any) => id.toString()).includes(userId);
          return {
            ...comment,
            likedByCurrentUser: liked ?? false,
            dislikedByCurrentUser: disliked ?? false,
          };
        });
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

app.post("/api/post/:id/like", async (req: SessionRequest, res: Response) => {
  try {
    const postId = req.params.id;
    // @ts-ignore
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Пост не найден");
    }

    const hasLiked = post.likes.some(id => id.toString() === userId.toString());

    let updatedPost;

    if (hasLiked) {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { likes: userId },
          $inc: { totallikes: -1 },
        },
        { new: true }
      );
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $addToSet: { likes: userId },
          $inc: { totallikes: 1 },
        },
        { new: true }
      );
    }

    res.send(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

app.post("/api/comment/:id/like", async (req: SessionRequest, res: Response) => {
  try {
    const commentId = req.params.id;
    // @ts-ignore
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).send("Пост не найден");
    }

    const hasLiked = comment.likes.some(id => id.toString() === userId.toString());

    let updatedComment;

    if (hasLiked) {
      updatedComment = await Comment.findByIdAndUpdate(
        comment,
        {
          $pull: { likes: userId },
          $inc: { totallikes: -1 },
        },
        { new: true }
      );
    } else {
      updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $addToSet: { likes: userId },
          $inc: { totallikes: 1 },
        },
        { new: true }
      );
    }

    res.send(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

app.post("/api/post/:id/dislike", async (req: SessionRequest, res: Response) => {
  try {
    const postId = req.params.id;
    // @ts-ignore
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).send("Пост не найден");
    }

    const hasDisliked = post.dislikes.some(id => id.toString() === userId.toString());

    let updatedPost;

    if (hasDisliked) {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: { dislikes: userId },
          $inc: { totallikes: 1 },
        },
        { new: true }
      );
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          $addToSet: { dislikes: userId },
          $inc: { totallikes: -1 },
        },
        { new: true }
      );
    }

    res.send(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

app.post("/api/comment/:id/dislike", async (req: SessionRequest, res: Response) => {
  try {
    const commentId = req.params.id;
    // @ts-ignore
    const userId = req.user._id;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).send("Пост не найден");
    }

    const hasDisliked = comment.dislikes.some(id => id.toString() === userId.toString());

    let updatedComment;

    if (hasDisliked) {
      updatedComment = await Comment.findByIdAndUpdate(
        comment,
        {
          $pull: { dislikes: userId },
          $inc: { totallikes: 1 },
        },
        { new: true }
      );
    } else {
      updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
          $addToSet: { dislikes: userId },
          $inc: { totallikes: -1 },
        },
        { new: true }
      );
    }

    res.send(updatedComment);
  } catch (error) {
    console.error(error);
    res.status(500).send("Ошибка сервера");
  }
});

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

app.post("/api/comment/create/:postId", async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user._id;
  const postId = req.params.postId;

  const { description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return res.status(400).send("Неверный ID поста");
  }

  const comment = await Comment.create({ author: userId, description });

  const post = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: comment._id } },
    { new: true }
  );

  if (!post) {
    await Comment.deleteOne({ _id: comment._id });
    return res.status(404).send("Пост не найден");
  }

  const populatedComment = await comment.populate("author");

  res.send(populatedComment);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});