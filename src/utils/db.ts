import { BoothZod } from "@/schemas/booth";
import { readFile, writeFile } from "fs/promises";
import { z } from "zod";

export const dataFile = process.env.DATA_FILE || "data.json";

const defaultData = {
  booths: [
    {
      id: "test1",
      name: "测试展台1",
      position: {
        x: 0,
        y: 0,
      },
      count: 100,
      minutes: 10,
      show: "count",
      card: {
        cover: "https://http.cat/404",
        info: "just for test",
      },
    },
    {
      id: "test2",
      name: "测试展台2",
      position: {
        x: 200,
        y: 200,
      },
      count: 100,
      minutes: 10,
      show: "count",
      card: {
        cover: "https://http.cat/404",
        info: "just for test",
      },
    },
    {
      id: "test3",
      name: "测试展台3",
      position: {
        x: 632,
        y: 540,
      },
      count: 100,
      minutes: 10,
      show: "count",
      card: {
        cover: "https://http.cat/404",
        info: "just for test",
      },
    },
    {
      id: "test4",
      name: "测试展台4",
      position: {
        x: 883,
        y: 654,
      },
      count: 100,
      minutes: 10,
      show: "count",
      card: {
        cover: "https://http.cat/404",
        info: "just for test",
      },
    },
  ],
};

let __DB__: Data | undefined = undefined;

export const DataZod = z.object({
  booths: BoothZod.array(),
});

export type Data = z.infer<typeof DataZod>;

export const readDb: () => Promise<Data> = async () => {
  if (__DB__) {
    return __DB__;
  }
  try {
    const db = await readFile(dataFile, "utf8").then(f => JSON.parse(f));
    __DB__ = DataZod.parse(db);
    return __DB__;
  } catch (_e) {
    await writeFile(dataFile, JSON.stringify(defaultData));
    return readDb();
  }
};

export async function saveDb() {
  const db = await readDb();
  await writeFile(dataFile, JSON.stringify(db), "utf8");
}
