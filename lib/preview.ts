import { fetchTodaysCommits } from "./github";
import { saveCommits, getTodaysClusters, type Cluster } from "./db";

export async function getTodaysPreview(userId: string, token: string): Promise<Cluster[]> {
  const commits = await fetchTodaysCommits(token);
  if (commits.length > 0) await saveCommits(userId, commits);
  return getTodaysClusters(userId);
}