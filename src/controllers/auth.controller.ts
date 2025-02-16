import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async register(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = req.body as { email: string; password: string };

      if (!email || !password) {
        return reply.status(400).send({ error: 'Email and password are required' });
      }

      const response = await AuthService.register(email, password);
      return reply.status(201).send(response);
    } catch (error) {
      console.error('[AuthController] Register Error:', error);

      if ((error as Error).message.includes('Email is already in use')) {
        return reply.status(409).send({ error: 'Email is already in use' });
      }

      return reply.status(400).send({ error: 'Registration failed' });
    }
  }

  static async login(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = req.body as { email: string; password: string };

      if (!email || !password) {
        return reply.status(400).send({ error: 'Email and password are required' });
      }

      const { token } = await AuthService.login(req.server, email, password);

      return reply.send({ token }); 
    } catch (error) {
      console.error('[AuthController] Login Error:', error);

      return reply.status(401).send({ error: 'Invalid email or password' });
    }
  }

  static async logout(req: FastifyRequest, reply: FastifyReply) {
    try {
      return reply.send({ message: 'User logged out successfully' });
    } catch (error) {
      console.error('[AuthController] Logout Error:', error);
      return reply.status(500).send({ error: 'Logout failed' });
    }
  }

  static async refresh(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req.user as { userId: number }).userId;


      const newToken = req.server.jwt.sign({ userId });

      return reply.send({ token: newToken });
    } catch (error) {
      console.error('[AuthController] Refresh Token Error:', error);
      return reply.status(401).send({ error: 'Token refresh failed' });
    }
  }
}
