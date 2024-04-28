import { z } from "zod";
import { publicProcedure, router } from "..";

export const appRouter = router({
  hello: publicProcedure.input(z.string()).output(z.string()).query(
    async ({ input }) => {
      return `hello ${input}`;
    },
  ),
});

export type AppRouter = typeof appRouter;
