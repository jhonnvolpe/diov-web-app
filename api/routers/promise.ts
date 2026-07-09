import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { promises } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";

export const promiseRouter = createRouter({
  list: publicQuery
    .input(z.object({ userId: z.number().optional() }))
    .query(async ({ input }: { input: { userId?: number } }) => {
      const db = getDb();
      if (input.userId) {
        return db.select().from(promises).where(eq(promises.userId, input.userId)).orderBy(desc(promises.date)).limit(90);
      }
      return db.select().from(promises).orderBy(desc(promises.date)).limit(90);
    }),

  getByDate: publicQuery
    .input(z.object({ date: z.string(), userId: z.number().optional() }))
    .query(async ({ input }: { input: { date: string; userId?: number } }) => {
      const db = getDb();
      const conditions = [eq(promises.date, input.date)];
      if (input.userId) conditions.push(eq(promises.userId, input.userId));
      const result = await db.select().from(promises).where(and(...conditions)).limit(1);
      return result[0] ?? null;
    }),

  save: publicQuery
    .input(z.object({
      userId: z.number().optional(),
      date: z.string(),
      text: z.string(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const existing = await db.select().from(promises).where(eq(promises.date, input.date)).limit(1);
      if (existing[0]) {
        await db.update(promises).set({ text: input.text, kept: null }).where(eq(promises.id, existing[0].id));
        return { ...existing[0], text: input.text, kept: null };
      }
      const result = await db.insert(promises).values(input).returning();
      return result[0];
    }),

  markKept: publicQuery
    .input(z.object({ date: z.string(), kept: z.boolean(), userId: z.number().optional() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const conditions = [eq(promises.date, input.date)];
      if (input.userId) conditions.push(eq(promises.userId, input.userId));
      await db.update(promises).set({ kept: input.kept }).where(and(...conditions));
      return { success: true };
    }),

  integrityScore: publicQuery
    .input(z.object({ userId: z.number().optional() }))
    .query(async ({ input }: { input: { userId?: number } }) => {
      const db = getDb();
      const all = input.userId
        ? await db.select().from(promises).where(eq(promises.userId, input.userId)).orderBy(desc(promises.date)).limit(90)
        : await db.select().from(promises).orderBy(desc(promises.date)).limit(90);
      const judged = all.filter((p: { kept: boolean | null }) => p.kept !== null);
      if (judged.length === 0) return null;
      const kept = judged.filter((p: { kept: boolean | null }) => p.kept === true).length;
      return Math.round((kept / judged.length) * 100);
    }),
});
