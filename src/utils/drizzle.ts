import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'

export { sql, eq, and, or, count, desc, sum, not } from 'drizzle-orm'
import * as schema from '../database/schema';

export const tables = schema;

const client = postgres(process.env.DATABASE_URL as string, {
    ssl: false,
    max: 20,
    idle_timeout: 5,
    connect_timeout: 10,
})

export const useDrizzle = () => {
    return drizzle(client, { schema })
}
