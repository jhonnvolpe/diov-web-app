import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { sleepLogs } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

export const sleepRouter = createRouter({
  list: publicQuery
    .input(z.object({ userId: z.number().optional() }))
    .query(async ({ input }: { input: { userId?: number } }) => {
      const db = getDb();
      if (input.userId) {
        return db.select().from(sleepLogs).where(eq(sleepLogs.userId, input.userId)).orderBy(desc(sleepLogs.date)).limit(90);
      }
      return db.select().from(sleepLogs).orderBy(desc(sleepLogs.date)).limit(90);
    }),

  getByDate: publicQuery
    .input(z.object({ date: z.string(), userId: z.number().optional() }))
    .query(async ({ input }: { input: { date: string; userId?: number } }) => {
      const db = getDb();
      const conditions = [eq(sleepLogs.date, input.date)];
      if (input.userId) conditions.push(eq(sleepLogs.userId, input.userId));
      const result = await db.select().from(sleepLogs).where(and(...conditions)).limit(1);
      return result[0] ?? null;
    }),

  create: publicQuery
    .input(z.object({
      userId: z.number().optional(),
      date: z.string(),
      quality: z.number().min(1).max(5),
      sleepTime: z.string(),
      wakeTime: z.string(),
      promiseKept: z.boolean().nullable(),
      gratitude: z.string().optional(),
      duration: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(sleepLogs).where(eq(sleepLogs.date, input.date)).limit(1);
      if (existing[0]) {
        await db.update(sleepLogs).set({
          quality: input.quality,
          sleepTime: input.sleepTime,
          wakeTime: input.wakeTime,
          promiseKept: input.promiseKept,
          gratitude: input.gratitude,
          duration: input.duration,
        }).where(eq(sleepLogs.id, existing[0].id));
        return { ...existing[0], ...input };
      }
      const result = await db.insert(sleepLogs).values(input).returning();
      return result[0];
    }),

  last7: publicQuery
    .input(z.object({ userId: z.number().optional() }))
    .query(async ({ input }: { input: { userId?: number } }) => {
      const db = getDb();
      if (input.userId) {
        return db.select().from(sleepLogs).where(eq(sleepLogs.userId, input.userId)).orderBy(desc(sleepLogs.date)).limit(7);
      }
      return db.select().from(sleepLogs).orderBy(desc(sleepLogs.date)).limit(7);
    }),
});
