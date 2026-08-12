import { auth } from "@/auth";
import { db } from "@/lib/dbClient";
import { accounts } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import {
  GitCommit,
  GitPullRequest,
  ArrowUpRight,
  Clock3,
} from "lucide-react";
import { getTodaysActivity } from "@/lib/activity";
import { FaGithub } from "react-icons/fa6";

// import { getRecentDigests } from "@/lib/db";
// TODO: re-enable once report generation is built

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <p className="text-neutral-400">Not authenticated</p>
      </main>
    );
  }

  const account = await db.query.accounts.findFirst({
    where: and(
      eq(accounts.userId, session.user.id),
      eq(accounts.provider, "github")
    ),
  });

  const token = account?.access_token;

  if (!token) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <p className="text-neutral-400">
          No GitHub account connected.
        </p>
      </main>
    );
  }

  const today = await getTodaysActivity(token);

  // const savedReports = await getRecentDigests(session.user.id);
  // TODO: re-enable later

  return (
    <main className="min-h-screen bg-[#fafafa] text-neutral-900">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 lg:px-12">

        {/* Header */}
        <header className="mb-10 flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm text-neutral-400">
              <FaGithub className="h-4 w-4" />

              <span>
                @{today.user.username}
              </span>
            </div>

            <h1 className="text-4xl font-medium tracking-tight md:text-5xl">
              Welcome,{" "}
              <span className="text-neutral-400">
                {today.user.name}
              </span>
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-500">
              Here's a quick look at what you've been
              working on across GitHub.
            </p>
          </div>

          <img
            src={today.user.avatarUrl}
            alt={today.user.name}
            className="h-11 w-11 rounded-full border border-neutral-200"
          />
        </header>

        {/* Today's Activity */}
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="text-sm font-medium">
              Today's activity
            </h2>

            <div className="flex items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-[11px] text-neutral-500">
                Live
              </span>
            </div>
          </div>

          {today.activity.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center px-6 text-center">
              <p className="text-sm text-neutral-600">
                No activity yet today
              </p>

              <p className="mt-1 max-w-xs text-xs leading-5 text-neutral-400">
                Your commits and pull requests will
                appear here as you work.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {today.activity.map((item) => {
                const isCommit = item.type === "commit";

                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-4 px-5 py-4 transition hover:bg-neutral-50"
                  >
                    {/* Activity Icon */}
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50">
                      {isCommit ? (
                        <GitCommit className="h-4 w-4 text-neutral-500" />
                      ) : (
                        <GitPullRequest className="h-4 w-4 text-neutral-500" />
                      )}
                    </div>

                    {/* Activity Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-neutral-800">
                            {item.title}
                          </p>

                          <p className="mt-1 truncate text-xs text-neutral-400">
                            {item.repositoryFullName}
                          </p>
                        </div>

                        <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-neutral-300 transition group-hover:text-neutral-600" />
                      </div>

                      {/* Time + Activity Type */}
                      <div className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-400">
                        <Clock3 className="h-3 w-3" />

                        {new Date(
                          item.timestamp
                        ).toLocaleTimeString([], {
                          hour: "numeric",
                          minute: "2-digit",
                        })}

                        <span>·</span>

                        <span>
                          {isCommit
                            ? "Commit"
                            : "Pull request"}
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </section>

        {/* Saved Reports — disabled until report generation is built */}
        {/*
        <section className="mt-10 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          ...
        </section>
        */}

      </div>
    </main>
  );
}