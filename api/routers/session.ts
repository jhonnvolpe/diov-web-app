import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { sessions } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const sessionRouter = createRouter({
  list: publicQuery
    .input(z.object({ userId: z.number().optional() }))
    .query(async ({ input }: { input: { userId?: number } }) => {
      const db = getDb();
      if (input.userId) {
        return db.select().from(sessions).where(eq(sessions.userId, input.userId)).orderBy(desc(sessions.startedAt)).limit(100);
      }
      return db.select().from(sessions).orderBy(desc(sessions.startedAt)).limit(100);
    }),

  start: publicQuery
    .input(z.object({
      userId: z.number().optional(),
      type: z.enum(["sleep", "wake"]),
      metadata: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const inserted = await db.insert(sessions).values({
        userId: input.userId ?? null,
        type: input.type,
        metadata: input.metadata ?? {},
      }).returning();
      return inserted[0];
    }),

  end: publicQuery
    .input(z.object({
      sessionId: z.number(),
      duration: z.number(),
      metadata: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.update(sessions).set({
        endedAt: new Date(),
        duration: input.duration,
        metadata: input.metadata ?? {},
      }).where(eq(sessions.id, input.sessionId));
      return { success: true };
    }),
});
