import { userTable } from '../models/user.model';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../plugins/drizzle';
import { FastifyInstance, RawServerDefault, FastifyBaseLogger, FastifyTypeProviderDefault } from 'fastify';
import { IncomingMessage, ServerResponse } from 'http';
export class AuthService {
  static async register(email: string, password: string) {
    try {
      const existingUser = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .execute();

      if (existingUser.length > 0) {
        throw new Error('Email is already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await db.insert(userTable).values({ email, password: hashedPassword });

      return { message: 'User registered successfully' };
    } catch (error) {
      console.error('[AuthService] Register Error:', error);
      throw error;
    }
  }

  static async login(server: FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault>, email: string, password: string) {
    try {
      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.email, email))
        .execute();

      if (user.length === 0) {
        throw new Error('Invalid email or password');
      }

      const isValid = await bcrypt.compare(password, user[0].password);
      if (!isValid) {
        throw new Error('Invalid email or password');
      }

    
      const token: string = server.jwt.sign({ userId: user[0].id });

      return { token }; 
    } catch (error) {
      console.error('[AuthService] Login Error:', error);
      throw error;
    }
  }
}
