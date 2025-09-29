import "fastify";
import "@fastify/jwt";

import { UserJwtPayload } from './utils/jwt';

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        user: UserJwtPayload
    }
}