import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const pool = new pg.Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
});

export const db = drizzle(pool, { schema });