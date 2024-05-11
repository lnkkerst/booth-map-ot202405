"use client";
import { boothsAtom, useUpdateBooths } from "@/atoms/booth";
import { Booth } from "@/schemas/booth";
import { trpc } from "@/utils/trpc";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { BoothModal } from "./components/BoothModal";

export default function AdminPage() {
  const boothsQuery = trpc.getBooths.useQuery();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [currentBooth, setCurrentBooth] = useState<Booth>();
  const [booths, setBooths] = useAtom(boothsAtom);
  const updateBooths = useUpdateBooths();
  const activeCountQuery = trpc.active.useQuery(undefined, {
    refetchInterval: 10000,
  });

  useEffect(() => {
    if (boothsQuery.data) {
      setBooths(boothsQuery.data);
    }
  }, [boothsQuery.data, setBooths]);

  trpc.onUpdate.useSubscription(undefined, {
    onStarted() {
      boothsQuery.refetch();
    },
    onData(data) {
      updateBooths(data);
    },
  });

  return (
    <div className="px-4 py-4 overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>展台</th>
            <th>人数</th>
            <th>等待时间（分钟）</th>
          </tr>
        </thead>

        <tbody>
          {booths.map(booth => (
            <tr
              className="hover"
              key={booth.id}
              onClick={() => {
                setCurrentBooth(booth);
                dialogRef.current?.showModal();
              }}
            >
              <td>{booth.name}</td>
              <td>
                {booth.show === "count"
                  ? (
                    booth.count
                  )
                  : <span className="text-gray-600 italic">不显示</span>}
              </td>
              <td>
                {booth.show === "minutes"
                  ? (
                    booth.minutes
                  )
                  : <span className="text-gray-600 italic">不显示</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-center mt-4 text-gray-600 text-sm">
        当前在线人数：
        {activeCountQuery.data
          ? <span>{activeCountQuery.data}</span>
          : <span className="loading loading-spinner loading-xs"></span>}
      </div>

      <BoothModal
        booth={currentBooth}
        onUpdated={() => {
          dialogRef.current?.close();
        }}
        ref={dialogRef}
      >
      </BoothModal>
    </div>
  );
}
