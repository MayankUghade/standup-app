import { getGithubUser, getGithubRepos, getGithubCommits, githubFetch } from "./github";

export type ActivityItem = {
  id: string;
  type: "commit" | "pull_request";
  title: string;
  repository: string;
  repositoryFullName: string;
  url: string;
  timestamp: string;
};

export type TodaysActivity = {
  user: { username: string; name: string; avatarUrl: string };
  activity: ActivityItem[];
};

interface SearchIssueResult {
  id: number;
  title: string;
  html_url: string;
  created_at: string;
  repository_url: string;
}

async function searchTodaysPRs(token: string, username: string, since: Date): Promise<ActivityItem[]> {
  const dateStr = since.toISOString().slice(0, 10);
  const query = `type:pr+author:${username}+created:>=${dateStr}`;
  const result = await githubFetch<{ items: SearchIssueResult[] }>(token, `/search/issues?q=${query}&per_page=50`);

  return result.items.map((pr) => {
    const parts = pr.repository_url.split("/");
    return {
      id: `pr-${pr.id}`,
      type: "pull_request" as const,
      title: pr.title,
      repository: parts[parts.length - 1],
      repositoryFullName: `${parts[parts.length - 2]}/${parts[parts.length - 1]}`,
      url: pr.html_url,
      timestamp: pr.created_at,
    };
  });
}

// Just today. Not this week, not stats — one clean feed of "what did I do today."
export async function getTodaysActivity(token: string): Promise<TodaysActivity> {
  const user = await getGithubUser(token);
  const allRepos = await getGithubRepos(token);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const now = new Date();

  const activeRepos = allRepos.filter((r) => r.pushed_at && new Date(r.pushed_at) >= startOfToday);

  const commitResults = await Promise.all(
    activeRepos.map(async (repo) => {
      const [owner, name] = repo.full_name.split("/");
      if (!owner || !name) return [];
      try {
        const commits = await getGithubCommits(token, owner, name, startOfToday, now);
        return commits.map((c) => ({ commit: c, repo }));
      } catch (err) {
        console.error(`[activity] Skipping ${repo.full_name}: ${(err as Error).message}`);
        return [];
      }
    })
  );
  const commits = commitResults.flat();

  const prs = await searchTodaysPRs(token, user.login, startOfToday).catch(() => []);

  const activity: ActivityItem[] = [
    ...commits.map(({ commit, repo }) => ({
      id: `commit-${commit.sha}`,
      type: "commit" as const,
      title: commit.commit.message.split("\n")[0],
      repository: repo.name,
      repositoryFullName: repo.full_name,
      url: commit.html_url,
      timestamp: commit.commit.author?.date ?? new Date().toISOString(),
    })),
    ...prs,
  ];

  activity.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    user: { username: user.login, name: user.name ?? user.login, avatarUrl: user.avatar_url },
    activity,
  };
}