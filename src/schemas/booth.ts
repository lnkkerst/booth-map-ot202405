import { z } from "zod";
import { PositionZod } from ".";

export const BoothZod = z.object({
  id: z.string(),
  name: z.string(),
  position: PositionZod,
  count: z.number(),
  minutes: z.number(),
  show: z.enum(["count", "minutes"]),
  card: z.object({
    cover: z.string(),
    info: z.string(),
  }),
});

export type Booth = z.infer<typeof BoothZod>;
