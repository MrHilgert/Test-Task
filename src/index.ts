import fastifyJwt from "@fastify/jwt";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { JwtPayload } from "jsonwebtoken";
import authSignInRoute from "./api/auth/sign-in";
import authSignUpRoute from "./api/auth/sign-up";
import gameStartRoute from "./api/game.start";
import gameTopRoute from "./api/top";

if (!process.env.JWT_SECRET)
    throw new Error('JWT_SECRET is not defined');

const app = fastify();

app.register(fastifyJwt, {
    secret: process.env.JWT_SECRET
});

app.register((instance) => {
    instance.post('/sign-up', authSignUpRoute);
    instance.post('/sign-in', authSignInRoute);
}, {
    prefix: '/auth'
});

app.register((instance) => {
    instance.decorate('authenticate', async function (req: FastifyRequest, res: FastifyReply) {
        try {
            await req.jwtVerify<JwtPayload>();
        } catch (error) {
            res.code(401).send({ error: 'Unauthorized' });
        }
    });

    instance.addHook('onRequest', async (req, res) => {
        await instance.authenticate(req, res);
    });

    instance.post('/game/start', gameStartRoute);
    instance.get('/top', gameTopRoute);
}, {
    prefix: '/api'
});

app.listen({
    host: '0.0.0.0',
    port: parseInt(process.env.PORT!)
}).then(() => {
    console.log(`Fastify listen on port: ${process.env.PORT!}`);
});

process.on('SIGTERM', () => {
    app.close().then(() => {
        process.exit(0);
    });
});