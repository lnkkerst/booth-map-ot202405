import { z } from "zod";

export const PositionZod = z.object({ x: z.number(), y: z.number() });

export type Position = z.infer<typeof PositionZod>;
