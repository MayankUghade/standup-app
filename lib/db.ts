import { db } from "./dbClient";
import { rawCommits, digests } from "./schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

interface Commit {
  repo: string;
  sha: string;
  message: string;
  filesChanged: number;
  committedAt: Date;
}

export interface Cluster {
  repo: string;
  theme: string;
  commits: { message: string; filesChanged: number }[];
}

export async function saveCommits(userId: string, commits: Commit[]) {
  if (commits.length === 0) return;
  await db
    .insert(rawCommits)
    .values(commits.map((c) => ({ userId, ...c })))
    .onConflictDoNothing({ target: rawCommits.sha });
}

const THEME_PATTERNS: { theme: string; pattern: RegExp }[] = [
  { theme: "feature", pattern: /^(feat|feature)[:(]/i },
  { theme: "bugfix", pattern: /^fix[:(]/i },
  { theme: "refactor", pattern: /^(refactor|perf)[:(]/i },
  { theme: "chore", pattern: /^(chore|deps|build|ci)[:(]/i },
  { theme: "docs", pattern: /^docs[:(]/i },
];

function classifyTheme(message: string): string {
  for (const { theme, pattern } of THEME_PATTERNS) {
    if (pattern.test(message)) return theme;
  }
  return "general";
}

export async function getClustersInRange(userId: string, since: Date, until: Date): Promise<Cluster[]> {
  const rows = await db
    .select()
    .from(rawCommits)
    .where(and(eq(rawCommits.userId, userId), gte(rawCommits.committedAt, since), lte(rawCommits.committedAt, until)))
    .orderBy(rawCommits.repo, rawCommits.committedAt);

  const clusterMap = new Map<string, Cluster>();
  for (const row of rows) {
    const theme = classifyTheme(row.message);
    const key = `${row.repo}::${theme}`;
    if (!clusterMap.has(key)) clusterMap.set(key, { repo: row.repo, theme, commits: [] });
    clusterMap.get(key)!.commits.push({ message: row.message, filesChanged: row.filesChanged ?? 0 });
  }
  return Array.from(clusterMap.values());
}

// Now returns the saved row (with its generated id) instead of nothing —
// the API route needs that id to build a "download PDF" link.
export async function markDigestSent(userId: string, date: string, summaries: unknown) {
  const [row] = await db
    .insert(digests)
    .values({ userId, digestDate: date, summariesJson: summaries })
    .returning();
  return row;
}

export async function getRecentDigests(userId: string, limit = 10) {
  return db
    .select()
    .from(digests)
    .where(eq(digests.userId, userId))
    .orderBy(sql`${digests.digestDate} desc`)
    .limit(limit);
}

// For the auto-popup: "is there already a report for today?"
export async function getDigestForDate(userId: string, date: string) {
  const rows = await db
    .select()
    .from(digests)
    .where(and(eq(digests.userId, userId), eq(digests.digestDate, date)))
    .orderBy(sql`${digests.sentAt} desc`)
    .limit(1);
  return rows[0] ?? null;
}

// For the "Download PDF" button — fetch the exact stored report by id,
// so downloading never re-runs the LLM.
export async function getDigestById(userId: string, id: string) {
  const rows = await db
    .select()
    .from(digests)
    .where(and(eq(digests.userId, userId), eq(digests.id, id)));
  return rows[0] ?? null;
}