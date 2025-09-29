import { FastifyReply, FastifyRequest } from "fastify";
import { eq, not, sql, tables, useDrizzle } from "../utils/drizzle";

const db = useDrizzle();

export default async (req: FastifyRequest, res: FastifyReply) => {
    const { id } = req.user;

    const opponent = (await db.select().from(tables.users).where(
        not(eq(tables.users.id, id))
    ).orderBy(sql`RANDOM()`).limit(1))[0];

    if (!opponent) {
        return res.status(404).send({
            error: 'Can\'t find opponent'
        });
    }

    const isWon = Math.random() < 0.5;

    const game = (await db.insert(tables.games).values({
        userId: id,
        opponentId: opponent.id,
        isWon
    }).returning())[0];

    return res.send({
        id: game.id,
        opponent: {
            id: opponent.id,
            username: opponent.username
        },
        isWon,
        playedAt: game.playedAt
    });
};