import { z } from "zod";
import { PositionZod } from ".";

export const BoothZod = z.object({
  id: z.string(),
  name: z.string(),
  position: PositionZod,
  count: z.number(),
});

export type Booth = z.infer<typeof BoothZod>;
