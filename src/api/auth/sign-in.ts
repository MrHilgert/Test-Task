import { FastifyReply, FastifyRequest } from "fastify";
import { eq, not, sql, tables, useDrizzle } from "../../utils/drizzle";
import { generateUserToken } from "../../utils/jwt";
import bcrypt from 'bcrypt';

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

    if (!dbUser) {
        return res.status(400).send({
            error: 'Invalid username or password'
        });
    }

    const passwordValid = await bcrypt.compare(password, dbUser.passwordHash);

    if (!passwordValid) {
        return res.status(400).send({
            error: 'Invalid username or password'
        });
    }

    return res.send({
        token: generateUserToken({
            id: dbUser.id,
            username: dbUser.username
        })
    });
};