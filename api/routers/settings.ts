import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { userSettings } from "@db/schema";
import { eq } from "drizzle-orm";

export const settingsRouter = createRouter({
  get: publicQuery
    .input(z.object({ userId: z.number().optional() }))
    .query(async ({ input }: { input: { userId?: number } }) => {
      const db = getDb();
      if (input.userId) {
        const result = await db.select().from(userSettings).where(eq(userSettings.userId, input.userId)).limit(1);
        return result[0] ?? null;
      }
      return null;
    }),

  save: publicQuery
    .input(z.object({
      userId: z.number().optional(),
      sleepTime: z.string(),
      wakeTime: z.string(),
      wakeIntensity: z.string(),
      language: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      if (input.userId) {
        const existing = await db.select().from(userSettings).where(eq(userSettings.userId, input.userId)).limit(1);
        if (existing[0]) {
          await db.update(userSettings).set({
            sleepTime: input.sleepTime,
            wakeTime: input.wakeTime,
            wakeIntensity: input.wakeIntensity,
            language: input.language ?? existing[0].language,
            updatedAt: new Date(),
          }).where(eq(userSettings.id, existing[0].id));
          return { ...existing[0], ...input, updatedAt: new Date() };
        }
      }
      const result = await db.insert(userSettings).values({
        userId: input.userId ?? null,
        sleepTime: input.sleepTime,
        wakeTime: input.wakeTime,
        wakeIntensity: input.wakeIntensity,
        language: input.language ?? "en",
      }).returning();
      return result[0];
    }),
});
