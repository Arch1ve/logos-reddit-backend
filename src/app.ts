import express, { Request, Response } from 'express';

// mongoose.connect(DATABASE_URL || '');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req: Request, res: Response) => {
  res.send("Работает")
})

app.use((req: Request, res: Response) => res.status(404).send("Страница не найдена"));


app.listen(3000, () => {
  console.log(`Server is running on http://localhost:${3000}`);
});
