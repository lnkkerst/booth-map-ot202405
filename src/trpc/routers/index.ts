import { Booth, BoothZod } from "@/schemas/booth";
import { getWss } from "@/server/wss";
import { getBooths, updateBooths } from "@/utils/booth";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { z } from "zod";
import { publicProcedure, router } from "..";

const ee = new EventEmitter();

export const appRouter = router({
  hello: publicProcedure
    .input(z.string())
    .output(z.string())
    .query(async ({ input }) => {
      return `hello ${input}`;
    }),

  getBooths: publicProcedure
    .input(z.void())
    .output(BoothZod.array())
    .query(async () => {
      return await getBooths();
    }),

  updateBooths: publicProcedure
    .input(
      z.object({
        data: BoothZod.partial().required({ id: true }),
        password: z.string(),
      }),
    )
    .output(BoothZod)
    .mutation(async ({ input }) => {
      const { password, data } = input;
      if (password !== process.env["ADMIN_PASSWORD"]) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
        });
      }
      const { id, ...extraData } = data;
      const booth = await updateBooths(id, extraData);
      ee.emit("update", booth);
      return booth;
    }),

  onUpdate: publicProcedure.subscription(() => {
    return observable<Booth[]>(emit => {
      const onUpdate = (data: Booth) => {
        emit.next([data]);
      };
      ee.on("update", onUpdate);
      return () => void ee.off("update", onUpdate);
    });
  }),

  auth: publicProcedure.input(z.object({ password: z.string() })).output(
    z.void(),
  ).mutation(async ({ input }) => {
    const { password } = input;
    if (password !== process.env["ADMIN_PASSWORD"]) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
      });
    }
  }),

  active: publicProcedure.input(z.void()).output(z.number()).query(async () => {
    const wss = getWss();
    return wss.clients.size;
  }),
});

export type AppRouter = typeof appRouter;
