import express, { Request, Response } from 'express';
import * as mongoose from "mongoose";
import User from "./models/user";

mongoose.connect("mongodb://localhost:27017/logos");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Работает")
})

// app.post("/user/create", (req: Request, res: Response) => {
//   const {email, password, username} = req.body
//
//   User.create({ email, password, username })
//     .then((user) => {
//       res.send(user)
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(403).send()
//     })
// })

app.use((req: Request, res: Response) => res.status(404).send("Страница не найдена"));


app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
