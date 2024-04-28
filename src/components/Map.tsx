"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import xlsBaiduMap from "@/assets/images/xls-baidumap.png";
import { mapAtom } from "@/atoms/map";
import { useAtom } from "jotai";
import { CRS, ImageOverlay, LatLng, map as createMap, Marker } from "leaflet";
import { ComponentPropsWithoutRef, useEffect, useRef } from "react";

export type MapProps = ComponentPropsWithoutRef<"div">;

export function Map({ ...extraProps }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [_, setMap] = useAtom(mapAtom);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const imgFile = xlsBaiduMap;

    const url = imgFile.src;
    const width = imgFile.width;
    const height = imgFile.height;
    const center = new LatLng(height / 2, width / 2);

    let map = createMap(el, {
      crs: CRS.Simple,
      attributionControl: false,
      minZoom: 0.1,
      maxZoom: 5,
    }).setView(center, 1);
    const imgLayer = new ImageOverlay(url, [
      [0, 0],
      [height, width],
    ]);
    map.addLayer(imgLayer);

    const booths = [{
      latlng: {
        lat: 368,
        lng: 654,
      },
    }, {
      latlng: {
        lat: 542,
        lng: 653,
      },
    }, {
      latlng: {
        lat: 464,
        lng: 236,
      },
    }, {
      latlng: {
        lat: 899,
        lng: 753,
      },
    }];

    booths.forEach(booth => {
      const marker = new Marker(booth.latlng);
      marker.addTo(map);
    });

    setMap(map);

    return () => void map.remove();
  }, [containerRef, setMap]);

  return (
    <>
      <div {...extraProps} ref={containerRef}></div>
    </>
  );
}
