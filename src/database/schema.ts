import { boolean, index, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: text('username').notNull(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow()
}, (table) => ({
    idxUsersUsername: index('idx_users_username').on(table.username)
}));

export const games = pgTable('games', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .notNull()
        .references(() => users.id),
    opponentId: integer('opponent_id')
        .notNull()
        .references(() => users.id),
    isWon: boolean('is_won').notNull(),
    playedAt: timestamp('played_at').notNull().defaultNow(),
}, (table) => ({
    idxGamesWinnerLoserId: index('idx_games_user_opponent_id').on(table.userId, table.opponentId),
}));