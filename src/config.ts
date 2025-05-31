import * as dotenv from 'dotenv';

dotenv.config();

export const { JWT_SECRET, DATABASE_URL, PORT } = process.env;
