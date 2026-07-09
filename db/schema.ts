import { pgTable, serial, varchar, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

// ─── USERS ──────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── SLEEP LOGS ─────────────────────────────────
export const sleepLogs = pgTable("sleep_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  quality: integer("quality").notNull().default(0), // 1-5
  sleepTime: varchar("sleep_time", { length: 5 }).notNull(), // HH:MM
  wakeTime: varchar("wake_time", { length: 5 }).notNull(), // HH:MM
  promiseKept: boolean("promise_kept"),
  gratitude: text("gratitude"),
  duration: integer("duration"), // minutes slept
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── PROMISES ───────────────────────────────────
export const promises = pgTable("promises", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
  text: text("text").notNull(),
  kept: boolean("kept"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── USER SETTINGS ──────────────────────────────
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).unique(),
  sleepTime: varchar("sleep_time", { length: 5 }).notNull().default("23:00"),
  wakeTime: varchar("wake_time", { length: 5 }).notNull().default("07:00"),
  wakeIntensity: varchar("wake_intensity", { length: 20 }).notNull().default("standard"),
  language: varchar("language", { length: 5 }).notNull().default("en"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── SESSIONS ───────────────────────────────────
export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: varchar("type", { length: 20 }).notNull(), // 'sleep' | 'wake'
  startedAt: timestamp("started_at").notNull().defaultNow(),
  endedAt: timestamp("ended_at"),
  duration: integer("duration"), // seconds
  metadata: jsonb("metadata"), // { breath_cycles, phrases_seen, etc. }
});
