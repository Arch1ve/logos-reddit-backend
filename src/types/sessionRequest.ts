import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export default interface SessionRequest extends Request {
  user?: string | JwtPayload;
}
