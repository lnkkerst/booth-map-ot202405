import { Booth } from "@/schemas/booth";
import { produce } from "immer";
import { atom, useSetAtom } from "jotai";
import { merge } from "lodash-es";
import { useCallback } from "react";

export const boothsAtom = atom<Booth[]>([]);

export const useUpdateBooths = () => {
  const setBooths = useSetAtom(boothsAtom);
  return useCallback((newBooths: Booth[]) => {
    setBooths(
      produce(draft => {
        newBooths.forEach(newBooth => {
          const booth = draft.find(booth => booth.id === newBooth.id);
          if (booth) {
            merge(booth, newBooth);
          } else {
            draft.push(newBooth);
          }
        });
      }),
    );
  }, [setBooths]);
};
