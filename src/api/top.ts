import { FastifyReply, FastifyRequest } from "fastify";
import { count, desc, eq, sql, tables, useDrizzle } from "../utils/drizzle";

const TOP_LIMIT = parseInt(process.env.TOP_LIMIT ?? '15');

const db = useDrizzle();

export default async (req: FastifyRequest, res: FastifyReply) => {
    const top = await db.select({
        user: {
            id: tables.games.userId,
            username: tables.users.username
        },
        wins: count()
    }).from(tables.games)
        .innerJoin(tables.users, eq(tables.games.userId, tables.users.id))
        .where(eq(tables.games.isWon, true))
        .orderBy(({ wins }) => desc(wins))
        .groupBy(
            tables.games.userId,
            tables.users.username
        )
        .limit(TOP_LIMIT);

    res.send({
        top
    });
};