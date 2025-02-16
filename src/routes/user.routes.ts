import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';

export default async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/profile', {
    preHandler: authMiddleware,
    schema: {
      response: {
        200: { 
          type: 'object', 
          properties: { 
            userId: { type: 'number' }, 
            email: { type: 'string' }, 
            createdAt: { type: 'string' }, 
            message: { type: 'string' } 
          } 
        },
        401: { type: 'object', properties: { error: { type: 'string' } } },
        404: { type: 'object', properties: { error: { type: 'string' } } }
      }
    }
  }, UserController.getProfile);
}
