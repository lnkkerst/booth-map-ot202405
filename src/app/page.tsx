"use client";
import { mapAtom } from "@/atoms/map";
import { useAtomValue } from "jotai";
import { DivOverlay, LeafletMouseEvent, Popup } from "leaflet";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const Map = dynamic(() => import("@/components/Map").then(c => c.Map), {
  ssr: false,
});

export default function Home() {
  const [latlng, setLatLng] = useState({ lat: 0, lng: 0 });
  const map = useAtomValue(mapAtom);
  const latlngRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    const onmousemove = (e: LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setLatLng({ lat, lng });
    };
    map.on("mousemove", onmousemove);

    return () => void map.off("mousemove", onmousemove);
  }, [map, latlngRef]);

  return (
    <div>
      <Map className="h-[500px]"></Map>
      <div ref={latlngRef}>{JSON.stringify(latlng)}</div>
    </div>
  );
}
