import Fastify from 'fastify';
import drizzlePlugin from './plugins/drizzle';
import jwtPlugin from './plugins/jwt';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes'; 

const fastify = Fastify();

fastify.register(drizzlePlugin);
fastify.register(jwtPlugin);

fastify.register(authRoutes);
fastify.register(userRoutes); 

export default fastify;
