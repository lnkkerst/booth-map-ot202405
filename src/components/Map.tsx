"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import xlsBaiduMap from "@/assets/images/xls-baidumap.png";
import { boothsAtom, useUpdateBooths } from "@/atoms/booth";
import { mapAtom } from "@/atoms/map";
import { Booth } from "@/schemas/booth";
import { trpc } from "@/utils/trpc";
import clsx from "clsx";
import { useAtom, useSetAtom } from "jotai";
import { CRS, DivIcon, LatLng, LatLngBounds } from "leaflet";
import { memo, useMemo } from "react";
import { ComponentPropsWithoutRef, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { ImageOverlay, MapContainer, Marker } from "react-leaflet";
import styles from "./Map.module.css";

export type MapProps = ComponentPropsWithoutRef<"div">;

const MemoImageOverlay = memo(ImageOverlay);

export function Map({ ...extraProps }: MapProps) {
  const setMap = useSetAtom(mapAtom);
  const [booths, setBooths] = useAtom(boothsAtom);
  const boothsQuery = trpc.getBooths.useQuery();
  const extraZoom = 0.3;

  useEffect(() => {
    if (boothsQuery.data) {
      setBooths(boothsQuery.data);
    }
  }, [boothsQuery.data, setBooths]);

  const imgFile = xlsBaiduMap;

  const url = useMemo(() => imgFile.src, [imgFile.src]);
  const width = useMemo(() => imgFile.width * extraZoom, [imgFile.width]);
  const height = useMemo(() => imgFile.height * extraZoom, [imgFile.height]);
  const center = useMemo(
    () => new LatLng(height / 2, width / 2),
    [width, height],
  );
  const bounds = useMemo(
    () =>
      new LatLngBounds([
        [0, 0],
        [height, width],
      ]),
    [height, width],
  );

  const updateBooths = useUpdateBooths();

  trpc.onUpdate.useSubscription(undefined, {
    onData(data) {
      updateBooths(data);
    },
  });

  return (
    <div>
      <MapContainer
        zoom={0}
        center={center}
        crs={CRS.Simple}
        minZoom={0}
        attributionControl={false}
        ref={setMap as any}
        {...extraProps}
      >
        <MemoImageOverlay url={url} bounds={bounds}></MemoImageOverlay>

        {booths.map(booth => (
          <Marker
            position={[
              booth.position.y * extraZoom,
              booth.position.x * extraZoom,
            ]}
            icon={new DivIcon({
              html: renderToString(
                <div
                  className={clsx(
                    "relative translate-x-[-50%] translate-y-[calc(-100%_-_8px)] w-20",
                    "flex flex-col items-center justify-center",
                  )}
                >
                  <div
                    className={clsx(
                      "w-16 h-16",
                      styles.bubble,
                      "bg-white drop-shadow-[0px_0px_2px_#444] after:!border-t-white",
                      "rounded-md",
                      "flex items-center justify-center",
                    )}
                  >
                    <span className="text-gray-700 font-bold text-xl">
                      {booth.count}
                    </span>
                    <span className="text-gray-500 font-medium text-xs"></span>
                  </div>

                  <div
                    className={clsx(
                      "absolute top-[calc(100%_+_10px)] bg-black/40 text-white px-2 py-1",
                      "mx-auto rounded-md",
                    )}
                  >
                    {booth.name}
                  </div>
                </div>,
              ),
              className: "booth-overlay",
              iconAnchor: [0, 0],
            })}
            key={JSON.stringify(booth)}
          >
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
