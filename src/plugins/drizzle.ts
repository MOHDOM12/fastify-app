import fp from 'fastify-plugin';
import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config(); 

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'test',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'test',
});

export const db = drizzle(pool);

export default fp(async (fastify) => {
  fastify.decorate('db', db);
});
