import {
  pgTable,
  text,
  timestamp,
  integer,
  primaryKey,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compositePk: primaryKey({
      columns: [vt.identifier, vt.token],
    }),
  })
);

export const repositories = pgTable("repositories", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  githubId: integer("github_id").notNull(),
  name: text("name").notNull(),
  fullName: text("full_name").notNull(),
  owner: text("owner").notNull(),
  url: text("url").notNull(),
  private: boolean("private").notNull(),
  defaultBranch: text("default_branch"),
  language: text("language"),
  lastSyncedAt: timestamp("last_synced_at", {
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const rawCommits = pgTable("raw_commits", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  repositoryId: text("repository_id")
    .notNull()
    .references(() => repositories.id, { onDelete: "cascade" }),
  sha: text("sha").notNull().unique(),
  message: text("message").notNull(),
  filesChanged: integer("files_changed").default(0),
  additions: integer("additions").default(0),
  deletions: integer("deletions").default(0),
  committedAt: timestamp("committed_at", {
    withTimezone: true,
  }).notNull(),
  ingestedAt: timestamp("ingested_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const pullRequests = pgTable("pull_requests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  repositoryId: text("repository_id")
    .notNull()
    .references(() => repositories.id, { onDelete: "cascade" }),
  githubId: integer("github_id").notNull(),
  number: integer("number").notNull(),
  title: text("title").notNull(),
  body: text("body"),
  state: text("state").notNull(),
  url: text("url").notNull(),
  author: text("author").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).notNull(),
  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  }).notNull(),
  closedAt: timestamp("closed_at", {
    withTimezone: true,
  }),
  mergedAt: timestamp("merged_at", {
    withTimezone: true,
  }),
  ingestedAt: timestamp("ingested_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const pullRequestReviews = pgTable("pull_request_reviews", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  repositoryId: text("repository_id")
    .notNull()
    .references(() => repositories.id, { onDelete: "cascade" }),
  pullRequestId: text("pull_request_id")
    .notNull()
    .references(() => pullRequests.id, { onDelete: "cascade" }),
  githubId: integer("github_id").notNull().unique(),
  state: text("state").notNull(),
  body: text("body"),
  url: text("url"),
  submittedAt: timestamp("submitted_at", {
    withTimezone: true,
  }).notNull(),
  author: text("author").notNull(),
  ingestedAt: timestamp("ingested_at", {
    withTimezone: true,
  }).defaultNow(),
});

export const digests = pgTable("digests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  startTime: timestamp("start_time", {
    withTimezone: true,
  }).notNull(),
  endTime: timestamp("end_time", {
    withTimezone: true,
  }).notNull(),
  summariesJson: jsonb("summaries_json").notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  }).defaultNow(),
  sentAt: timestamp("sent_at", {
    withTimezone: true,
  }),
});