import { BoothZod } from "@/schemas/booth";
import { readFile, writeFile } from "fs/promises";
import { z } from "zod";

export const dataFile = process.env.DATA_FILE || "data.json";

const defaultData: Data = {
  booths: [
    {
      id: "1",
      name: "水拓DIY",
      count: 0,
      minutes: 0,
      card: {
        cover: "https://s21.ax1x.com/2024/05/28/pk1L156.png",
        info:
          "使用提供的飘漆滴入水中，用画笔进行晕染，将扇子浸没入水中，拿出后得到 DIY 漆扇。",
      },
      position: { x: 510, y: 1335 },
      show: "count",
    },
    {
      id: "2",
      name: "飞行日记",
      count: 0,
      minutes: 0,
      card: {
        cover: "https://s21.ax1x.com/2024/05/28/pk1LJ2D.png",
        info:
          "参与者使用活动提供的纸张叠纸飞机（可在纸上写文字），远处摆放标靶，参与者站在投掷线后扔出纸飞机，根据纸飞机在靶子上的落点，领取奖励",
      },
      position: { x: 1335, y: 2160 },
      show: "count",
    },
    {
      id: "3",
      name: "带走你的学士帽",
      count: 0,
      minutes: 0,
      card: {
        cover: "https://s21.ax1x.com/2024/05/28/pk1LG8O.png",
        info:
          "活动点提供学士帽、簪花、字母贴纸等物品，参与者可将上述物品粘贴到学士帽上进行 DIY 装饰。",
      },
      position: { x: 1420, y: 1440 },
      show: "count",
    },
    {
      id: "4",
      name: "水上嘉年华",
      count: 0,
      minutes: 0,
      card: {
        cover: "https://s21.ax1x.com/2024/05/28/pk1L8PK.png",
        info: "在指定区域内进行水球乱战，活动点提供水球、水枪、雨衣等装备。",
      },
      position: { x: 1070, y: 425 },
      show: "count",
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
