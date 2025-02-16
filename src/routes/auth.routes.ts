import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/auth.controller';
import { RegisterSchema, LoginSchema } from '../schemas/auth.schema';
import { authMiddleware } from '../middleware/auth.middleware';

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', {
    schema: {
      body: RegisterSchema,
      response: {  
        201: { type: 'object', properties: { message: { type: 'string' } } },
        400: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, AuthController.register);

  fastify.post('/login', {
    schema: {
      body: LoginSchema,
      response: {  
        200: { type: 'object', properties: { token: { type: 'string' } } },
        401: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, AuthController.login);

  fastify.post('/logout', {
    preHandler: authMiddleware,
    schema: {  
      response: {
        200: { type: 'object', properties: { message: { type: 'string' } } }
      }
    }
  }, AuthController.logout);

  fastify.get('/refresh', {
    preHandler: authMiddleware,
    schema: {  
      response: {
        200: { type: 'object', properties: { token: { type: 'string' } } },
        401: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, AuthController.refresh);
}
