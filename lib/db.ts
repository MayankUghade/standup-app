import { db } from "./dbClient";
import { rawCommits, digests } from "./schema";
import { eq, and, gte, sql } from "drizzle-orm";

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

export async function getTodaysClusters(userId: string): Promise<Cluster[]> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const rows = await db
    .select()
    .from(rawCommits)
    .where(and(eq(rawCommits.userId, userId), gte(rawCommits.committedAt, since)))
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

export async function markDigestSent(userId: string, date: string, summaries: unknown) {
  await db.insert(digests).values({ userId, digestDate: date, summariesJson: summaries });
}

export async function getRecentDigests(userId: string, limit = 10) {
  return db
    .select()
    .from(digests)
    .where(eq(digests.userId, userId))
    .orderBy(sql`${digests.digestDate} desc`)
    .limit(limit);
}