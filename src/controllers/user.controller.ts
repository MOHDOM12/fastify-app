import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../plugins/drizzle';
import { userTable } from '../models/user.model';
import { eq } from 'drizzle-orm';

export class UserController {
  static async getProfile(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req.user as { userId: number }).userId;

      const user = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId))
        .execute();

      if (user.length === 0) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return reply.send({
        userId: user[0].id,
        email: user[0].email, 
        createdAt: user[0].createdAt, 
        message: 'User profile retrieved successfully'
      });
    } catch (error) {
      console.error('[UserController] Profile Error:', error);
      return reply.status(500).send({ error: 'Something went wrong' });
    }
  }
}
