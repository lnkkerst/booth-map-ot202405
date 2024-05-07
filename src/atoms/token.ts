import { atomWithStorage } from "jotai/utils";

export const tokenAtom = atomWithStorage<string | undefined>(
  "booth-map-token",
  undefined,
);
