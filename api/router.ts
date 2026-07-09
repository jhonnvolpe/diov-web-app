import { createRouter, publicQuery } from "./middleware";
import { sleepRouter } from "./routers/sleep";
import { promiseRouter } from "./routers/promise";
import { settingsRouter } from "./routers/settings";
import { sessionRouter } from "./routers/session";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  sleep: sleepRouter,
  promise: promiseRouter,
  settings: settingsRouter,
  session: sessionRouter,
});

export type AppRouter = typeof appRouter;
