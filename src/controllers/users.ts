import bcrypt from "bcryptjs";
import User from "../models/user";
import { Request, Response } from 'express';
import {JWT_SECRET} from "../config";
import jwt from 'jsonwebtoken';
import SessionRequest from "../types/sessionRequest";


export const createUser = (req: Request, res: Response ) => {
  const {email, password, username} = req.body


  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, username, password: hash,
    }))
    .then((user) => {
      const tempUser = user.toObject();
      // @ts-ignore
      delete tempUser.password;
      res.status(201).send(tempUser);
    })
    .catch((error) => {
      if (error.code === 11000) {
        return res.status(409).send('Пользователь с таким email уже существует');
      }
      if (error.name === 'ValidationError') {
        return res.status(403).send('Переданы некорректные данные при создании пользователя.');
      }
      return res.status(500).send("Ошибка сервера");
    });
};

export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return res.status(403).send('Неправильные почта или пароль');

      }
      if (!JWT_SECRET) {
        return res.status(500).send("Ошибка сервера");
      }
      return res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET),
      });
    })
    .catch((err) => {
      console.log(err)
      return res.status(500).send("Ошибка сервера");
    });
};

export const getCurrentUser = (req: SessionRequest, res: Response) => {
  // @ts-ignore
  const userId = req.user._id;

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send('Пользователь с указанным _id не найден.')
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      return res.status(500).send("Ошибка сервера");
    });
};