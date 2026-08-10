const GITHUB_API = "https://api.github.com";

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export interface RepoSummary {
  name: string;
  fullName: string;
  private: boolean;
  pushedAt: string;
}

async function getAuthenticatedLogin(token: string): Promise<string> {
  const res = await fetch(`${GITHUB_API}/user`, { headers: headers(token) });
  if (!res.ok) throw new Error(`GitHub /user fetch failed: ${res.status}`);
  const data = await res.json();
  return data.login as string;
}

export async function listActiveRepos(token: string): Promise<RepoSummary[]> {
  const login = await getAuthenticatedLogin(token);
  const res = await fetch(`${GITHUB_API}/users/${login}/repos?sort=pushed&per_page=20`, {
    headers: headers(token),
  });
  if (!res.ok) throw new Error(`GitHub repos fetch failed: ${res.status}`);
  const repos = await res.json();
  return (repos as any[]).map((r) => ({
    name: r.name,
    fullName: r.full_name,
    private: r.private,
    pushedAt: r.pushed_at,
  }));
}

// GitHub's commits endpoint supports BOTH since and until — that's what
// makes an arbitrary window possible, not just "last N hours from now."
async function listCommitsInRange(login: string, token: string, repo: string, since: string, until: string) {
  const url = `${GITHUB_API}/repos/${login}/${repo}/commits?author=${login}&since=${since}&until=${until}`;
  const res = await fetch(url, { headers: headers(token) });
  if (!res.ok) {
    if (res.status === 409) return [];
    throw new Error(`GitHub commits fetch failed for ${repo}: ${res.status}`);
  }
  return res.json();
}

async function getCommitDetail(login: string, token: string, repo: string, sha: string) {
  const res = await fetch(`${GITHUB_API}/repos/${login}/${repo}/commits/${sha}`, {
    headers: headers(token),
  });
  if (!res.ok) return { files: [] };
  return res.json();
}

export interface GithubCommit {
  repo: string;
  sha: string;
  message: string;
  filesChanged: number;
  committedAt: Date;
}

// Now takes an explicit window instead of assuming "last 24h from now."
export async function fetchCommitsInRange(token: string, since: Date, until: Date): Promise<GithubCommit[]> {
  const login = await getAuthenticatedLogin(token);
  const repos = await listActiveRepos(token);
  const sinceIso = since.toISOString();
  const untilIso = until.toISOString();

  const allCommits: GithubCommit[] = [];
  for (const repo of repos) {
    const commits = await listCommitsInRange(login, token, repo.name, sinceIso, untilIso);
    for (const c of commits as any[]) {
      const detail = await getCommitDetail(login, token, repo.name, c.sha);
      allCommits.push({
        repo: repo.name,
        sha: c.sha,
        message: c.commit.message.split("\n")[0],
        filesChanged: detail.files?.length ?? 0,
        committedAt: new Date(c.commit.author.date),
      });
    }
  }
  return allCommits;
}