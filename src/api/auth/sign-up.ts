import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from "fastify";
import { eq, tables, useDrizzle } from "../../utils/drizzle";
import { generateUserToken } from "../../utils/jwt";

const db = useDrizzle();

export default async (req: FastifyRequest, res: FastifyReply) => {
    if (!req.body) {
        return res.status(400).send({
            error: 'Bad Request'
        });
    }
    
    const { username, password } = req.body as { username: string, password: string };

    if (!username || !password) {
        return res.status(400).send({
            error: 'Bad Request'
        });
    }

    const dbUser = (await db.select().from(tables.users).where(eq(tables.users.username, username)))[0];

    if (dbUser) {
        return res.status(400).send({
            error: 'User already exists'
        });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = (await db.insert(tables.users).values({
        username, passwordHash
    }).returning({
        id: tables.users.id,
        username: tables.users.username
    }))[0];

    return res.send({
        token: generateUserToken({
            id: user.id,
            username: user.username
        })
    });
};