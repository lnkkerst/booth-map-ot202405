"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import xlsMap from "@/assets/images/xls-map-v1.png";
import { boothsAtom, useUpdateBooths } from "@/atoms/booth";
import { mapAtom } from "@/atoms/map";
import { Booth } from "@/schemas/booth";
import { trpc } from "@/utils/trpc";
import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { useAtom } from "jotai";
import {
  CRS,
  DivIcon,
  LatLng,
  LatLngBounds,
  LeafletMouseEventHandlerFn,
} from "leaflet";
import { memo, useMemo, useRef, useState } from "react";
import { ComponentPropsWithoutRef, useEffect } from "react";
import { renderToString } from "react-dom/server";
import { ImageOverlay, MapContainer, Marker } from "react-leaflet";
import { BoothCard } from "./BoothCard";
import { BoothCardModal } from "./BoothCardModal";
import styles from "./Map.module.css";

export type MapProps = ComponentPropsWithoutRef<"div">;

const MemoImageOverlay = memo(ImageOverlay);

export function Map({ className, ...extraProps }: MapProps) {
  const [map, setMap] = useAtom(mapAtom);
  const [booths, setBooths] = useAtom(boothsAtom);
  const boothsQuery = trpc.getBooths.useQuery();
  const extraZoom = 0.3;
  const [selectedBooth, setSelectedBooth] = useState<Booth | undefined>(
    undefined,
  );
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    if (boothsQuery.data) {
      setBooths(boothsQuery.data);
    }
  }, [boothsQuery.data, setBooths]);

  useEffect(() => {
    if (!map) {
      return;
    }
    const onClick: LeafletMouseEventHandlerFn = e => {
      let el = e.originalEvent.target;
      let isMarker = false;
      for (let i = 1; i <= 5; ++i) {
        if (el instanceof HTMLElement) {
          if (el.classList.contains("markder-container")) {
            isMarker = true;
            break;
          }
          if (el.parentElement) {
            el = el.parentElement;
          }
        }
      }
      if (!isMarker) {
        return;
      }
      if (el instanceof HTMLElement && el.dataset.boothIndex) {
        const index = Number.parseInt(el.dataset.boothIndex);
        setSelectedBooth(booths[index]);
        setShowCard(true);
      }
    };
    map.on("click", onClick);
    return () => void map.off("click", onClick);
  });

  const imgFile = xlsMap;

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
        zoom={1}
        zoomSnap={0}
        zoomDelta={0.25}
        center={center}
        crs={CRS.Simple}
        minZoom={0}
        attributionControl={false}
        ref={setMap as any}
        className={clsx("!bg-[#fff5e2]", className)}
        {...extraProps}
      >
        <MemoImageOverlay url={url} bounds={bounds}></MemoImageOverlay>

        {booths.map((booth, index) => (
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
                    "markder-container",
                  )}
                  data-booth-index={index}
                >
                  <div
                    className={clsx(
                      "w-[4.5rem] h-[4.5rem]",
                      styles.bubble,
                      "bg-white/80 11drop-shadow-[0px_0px_2px_#444] after:!border-t-white",
                      "rounded-full",
                      "flex items-center justify-center",
                    )}
                  >
                    {booth.show === "count"
                      ? (
                        <>
                          <span className="text-gray-700 font-bold text-xl">
                            {booth.count}
                          </span>
                          <span className="text-gray-500 font-medium text-xs">
                            人
                          </span>
                        </>
                      )
                      : (
                        <div>
                          <div className="text-gray-500 font-medium text-xs">
                            等待
                          </div>
                          <div className="text-gray-700 font-bold text-xl">
                            {booth.minutes}
                          </div>
                          <div className="text-gray-500 font-medium text-xs">
                            分钟
                          </div>
                        </div>
                      )}
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

      <Transition
        show={showCard}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className={clsx("fixed bottom-10 left-0 w-full mx-auto z-[9999]")}
        >
          <BoothCard
            showClose={true}
            booth={selectedBooth}
            className="mx-auto w-[90%] max-w-[720px] shadow-xl"
            onClose={() => setShowCard(false)}
          >
          </BoothCard>
        </div>
      </Transition>
    </div>
  );
}
