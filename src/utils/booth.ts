import { Booth } from "@/schemas/booth";
import { TRPCError } from "@trpc/server";
import { merge } from "lodash-es";
import { readDb, saveDb } from "./db";

export async function getBooths(): Promise<Booth[]> {
  const db = await readDb();
  return db.booths;
}

export async function updateBooths(
  id: string,
  data: Partial<Booth>,
): Promise<Booth> {
  const db = await readDb();
  const booth = db.booths.find(booth => booth.id === id);
  if (!booth) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Booth with id ${id} not found`,
    });
  }
  merge(booth, data);
  saveDb();
  return booth;
}
