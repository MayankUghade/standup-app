import { db } from "./dbClient";
import { accounts, users} from "./schema";
import { eq, and } from "drizzle-orm";

// the actual GitHub access_token,
// stored by the Drizzle adapter when the user signed in.
export async function getGithubToken(userId: string): Promise<string | null> {
  const rows = await db
    .select({ accessToken: accounts.access_token })
    .from(accounts)
    .where(and(eq(accounts.provider, "github"), eq(accounts.userId, userId)));

  return rows[0]?.accessToken ?? null;
}

export interface GithubUserAccount {
  userId: string;
  email: string | null;
  accessToken: string;
}

// Used by cron — loops over every user who's ever signed in with GitHub.
export async function getAllGithubAccounts(): Promise<GithubUserAccount[]> {
  const rows = await db
    .select({
      userId: accounts.userId,
      email: users.email,
      accessToken: accounts.access_token,
    })
    .from(accounts)
    .innerJoin(users, eq(accounts.userId, users.id))
    .where(eq(accounts.provider, "github"));
 
  return rows
    .filter((r): r is { userId: string; email: string | null; accessToken: string } => Boolean(r.accessToken))
    .map((r) => ({ userId: r.userId, email: r.email, accessToken: r.accessToken as string }));
}