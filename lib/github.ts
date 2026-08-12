const GITHUB_API = "https://api.github.com";

export async function githubFetch<T>(
  token: string,
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${GITHUB_API}${endpoint}`;

  console.log("GitHub request:", url);

  const response = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `GitHub API Error ${response.status} on ${url}: ${error}`
    );
  }

  return response.json() as Promise<T>;
}

// -------------------------
// GitHub User
// -------------------------

export type GithubUser = {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
  html_url: string;
};

export async function getGithubUser(token: string) {
  return githubFetch<GithubUser>(
    token,
    "/user"
  );
}


// -------------------------
// Repositories
// -------------------------

export type GithubRepo = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  language: string | null;
  default_branch: string;
  pushed_at: string | null;
};

export async function getGithubRepos(token: string) {
  return githubFetch<GithubRepo[]>(
    token,
    "/user/repos?per_page=100&sort=pushed"
  );
}


// -------------------------
// Commits
// -------------------------

export type GithubCommit = {
  sha: string;

  commit: {
    message: string;

    author: {
      name: string | null;
      email: string | null;
      date: string | null;
    } | null;
  };

  html_url: string;

  author: {
    login: string;
    avatar_url: string;
  } | null;
};

export async function getGithubCommits(
  token: string,
  owner: string,
  repo: string,
  since?: Date,
  until?: Date
) {
  const params = new URLSearchParams({
    per_page: "100",
  });

  if (since) {
    params.set("since", since.toISOString());
  }

  if (until) {
    params.set("until", until.toISOString());
  }

  return githubFetch<GithubCommit[]>(
    token,
    `/repos/${owner}/${repo}/commits?${params.toString()}`
  );
}


// -------------------------
// Pull Requests
// -------------------------

export type GithubPullRequest = {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  html_url: string;
  created_at: string;
  updated_at: string;
  merged_at: string | null;

  user: {
    login: string;
    avatar_url: string;
  };
};

export async function getGithubPullRequests(
  token: string,
  owner: string,
  repo: string
) {
  return githubFetch<GithubPullRequest[]>(
    token,
    `/repos/${owner}/${repo}/pulls?state=all&per_page=100`
  );
}


// -------------------------
// Activity
// -------------------------

export async function getGithubActivity(token: string) {
  const user = await getGithubUser(token);

  return githubFetch(
    token,
    `/users/${user.login}/events?per_page=100`
  );
}