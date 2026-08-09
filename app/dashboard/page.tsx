import { auth, signIn, signOut } from "@/auth";
import { getGithubToken } from "@/lib/getGithubAccount";
import { listActiveRepos } from "@/lib/github";
import { getTodaysPreview } from "@/lib/preview";
import { getRecentDigests } from "@/lib/db";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();

  // Not signed in
  if (!session?.user?.id) {
    redirect("/")
  }

  const token = await getGithubToken(session.user.id);

  const [repos, clusters, digestHistory] = token
    ? await Promise.all([
        listActiveRepos(token).catch(() => []),
        getTodaysPreview(session.user.id, token).catch(() => []),
        getRecentDigests(session.user.id),
      ])
    : [[], [], await getRecentDigests(session.user.id)];

  return (
    <main className="min-h-screen">

      {/* Dashboard */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Welcome + Action */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <p className="text-sm font-medium text-[#f97316] mb-2">
              Dashboard
            </p>

            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
              Good to see you, {session.user.name?.split(" ")[0]}.
            </h2>

            <p className="mt-2 text-[#78716c]">
              Here's what you've been working on today.
            </p>
          </div>

          <form action="/api/trigger" method="POST">
            <button
              type="submit"
              className="rounded-full bg-[#f97316] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ea580c] hover:shadow-lg hover:shadow-orange-500/20"
            >
              Run digest
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-2xl border border-[#e5ded3] bg-white p-5">
            <p className="text-sm text-[#78716c]">Today's activity</p>
            <p className="mt-2 text-3xl font-semibold">
              {clusters.length}
            </p>
            <p className="mt-1 text-xs text-[#a8a29e]">
              activity clusters
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5ded3] bg-white p-5">
            <p className="text-sm text-[#78716c]">Connected repos</p>
            <p className="mt-2 text-3xl font-semibold">
              {repos.length}
            </p>
            <p className="mt-1 text-xs text-[#a8a29e]">
              active repositories
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5ded3] bg-white p-5">
            <p className="text-sm text-[#78716c]">Standups generated</p>
            <p className="mt-2 text-3xl font-semibold">
              {digestHistory.length}
            </p>
            <p className="mt-1 text-xs text-[#a8a29e]">
              saved digests
            </p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Activity */}
          <section className="lg:col-span-2 rounded-2xl border border-[#e5ded3] bg-white overflow-hidden">
            <div className="px-6 py-5 border-b border-[#eee8df] flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Today's activity</h3>
                <p className="text-sm text-[#78716c] mt-1">
                  What you've been shipping today.
                </p>
              </div>

              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#fff1e8] text-[#ea580c]">
                Today
              </span>
            </div>

            <div className="p-6">
              {clusters.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-[#78716c]">
                    No commits pulled yet today.
                  </p>

                  <p className="text-xs text-[#a8a29e] mt-1">
                    Run a digest to pull your latest GitHub activity.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {clusters.map((c, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-[#eee8df] p-4 hover: transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {c.repo}
                        </span>

                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#f5f1eb] text-[#78716c]">
                          {c.theme}
                        </span>
                      </div>

                      <ul className="mt-3 space-y-2">
                        {c.commits.map((commit, j) => (
                          <li
                            key={j}
                            className="text-sm text-[#57534e] flex gap-2"
                          >
                            <span className="text-[#f97316]">•</span>
                            {commit.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>


          {/* Connected Repositories */}
          <section className="rounded-2xl border border-[#e5ded3] bg-white overflow-hidden">
            <div className="px-6 py-5 border-b border-[#eee8df] flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Connected repositories</h3>
                <p className="text-sm text-[#78716c] mt-1">
                  Repositories Standup is watching.
                </p>
              </div>

              <span className="text-sm font-medium text-[#57534e]">
                {repos.length}
              </span>
            </div>

            <div className="p-6">
              {repos.length === 0 ? (
                <p className="text-sm text-[#78716c]">
                  No repositories found.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {repos.slice(0, 4).map((repo) => (
                      <div
                        key={repo.fullName}
                        className="rounded-lg border border-[#eee8df] bg-[#faf8f4] px-3 py-2 text-sm text-[#57534e]"
                      >
                        <span className="truncate">
                          {repo.fullName.split("/").pop()}
                        </span>

                        {repo.private && (
                          <span className="ml-1.5 text-xs text-[#a8a29e]">
                            private
                          </span>
                        )}
                      </div>
                    ))}

                    {repos.length > 4 && (
                      <div className="rounded-lg border border-[#eee8df] bg-[#faf8f4] px-3 py-2 text-sm text-[#78716c]">
                        +{repos.length - 4} more
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="mt-5 text-sm font-medium text-[#f97316] hover:text-[#ea580c] transition-colors"
                  >
                    Manage repositories →
                  </button>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Previous Digests */}
        <section className="mt-6 rounded-2xl border border-[#e5ded3] bg-white overflow-hidden">
          <div className="px-6 py-5 border-b border-[#eee8df]">
            <h3 className="font-semibold">Previous standups</h3>
            <p className="text-sm text-[#78716c] mt-1">
              Your recently generated reports.
            </p>
          </div>

          <div className="p-6">
            {digestHistory.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-[#78716c]">
                  No standups generated yet.
                </p>

                <p className="text-xs text-[#a8a29e] mt-1">
                  Your generated reports will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {digestHistory.map((d) => (
                  <div
                    key={d.digestDate as string}
                    className="border-b border-[#eee8df] last:border-0 pb-5 last:pb-0"
                  >
                    <p className="text-sm font-semibold">
                      {new Date(
                        d.digestDate as string
                      ).toDateString()}
                    </p>

                    <ul className="mt-3 space-y-2">
                      {(
                        d.summariesJson as {
                          repo: string;
                          theme: string;
                          summary: string;
                        }[]
                      ).map((summary, i) => (
                        <li
                          key={i}
                          className="text-sm text-[#57534e]"
                        >
                          <strong className="text-[#1c1917]">
                            {summary.repo} · {summary.theme}:
                          </strong>{" "}
                          {summary.summary}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}