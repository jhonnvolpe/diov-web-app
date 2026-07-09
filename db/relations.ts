import { relations } from "drizzle-orm";
import { users, sleepLogs, promises, userSettings, sessions } from "./schema";

export const usersRelations = relations(users, ({ many, one }) => ({
  sleepLogs: many(sleepLogs),
  promises: many(promises),
  settings: one(userSettings),
  sessions: many(sessions),
}));

export const sleepLogsRelations = relations(sleepLogs, ({ one }) => ({
  user: one(users, { fields: [sleepLogs.userId], references: [users.id] }),
}));

export const promisesRelations = relations(promises, ({ one }) => ({
  user: one(users, { fields: [promises.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));
