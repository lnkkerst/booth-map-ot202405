import { Booth, BoothZod } from "@/schemas/booth";
import { TRPCError } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { merge } from "lodash-es";
import { z } from "zod";
import { publicProcedure, router } from "..";

const booths: Booth[] = [
  {
    id: "test1",
    name: "测试展台1",
    position: {
      x: 0,
      y: 0,
    },
    count: 100,
  },
  {
    id: "test2",
    name: "测试展台2",
    position: {
      x: 200,
      y: 200,
    },
    count: 100,
  },
  {
    id: "test3",
    name: "测试展台3",
    position: {
      x: 632,
      y: 540,
    },
    count: 100,
  },
];

async function getBooths() {
  return booths;
}

async function updateBooths(id: string, data: Partial<Booth>) {
  const booth = booths.find(booth => booth.id === id);
  if (!booth) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Booth with id ${id} not found`,
    });
  }
  merge(booth, data);
  return booth;
}

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
});

export type AppRouter = typeof appRouter;
