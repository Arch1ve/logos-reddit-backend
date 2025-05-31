import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import SessionRequest from "../types/sessionRequest";


const extractBearerToken = (header: string) => header.replace('Bearer ', '');

// eslint-disable-next-line consistent-return
export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send('Необходима авторизация')

  }

  const token = extractBearerToken(authorization);
  let payload;

  if (!JWT_SECRET) {
    return res.status(500).send("Ошибка сервера");
  }

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).send('Передан некорректный токен')
  }

  req.user = payload;

  next();
};
