import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { CsvData } from "../pages";
import "mapbox-gl/dist/mapbox-gl.css";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN ?? "";

interface MapProps {
  data: CsvData[];
  selectedDecade: number;
}

const getColorFromRiskRating = (riskRating: number) => {
  if (riskRating < 0.3) return "green";
  if (riskRating < 0.7) return "yellow";
  return "red";
};

const Map: React.FC<MapProps> = ({ data, selectedDecade }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapContainer.current) {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-99.95312500000001, 54.977005492196],
        zoom: 3.1,
      });

      newMap.on("load", () => {
        newMap.addControl(new mapboxgl.NavigationControl(), "top-right");

        setMap(newMap);
      });

      return () => {
        newMap.remove();
      };
    }
  }, []);

  useEffect(() => {
    if (map && data) {
      data.forEach((row) => {
        if (Math.floor(row.Year / 10) * 10 === selectedDecade) {
          const marker = new mapboxgl.Marker({
            color: getColorFromRiskRating(row["Risk Rating"]),
          })
            .setLngLat([row.Long, row.Lat])
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<div class="bg-white text-black ">
                  <p class="font-bold mb-1">Asset Name: <span class="font-normal">${row["Asset Name"]}</span></p>
                  <p class="font-bold">Business Category: <span class="font-normal">${row["Business Category"]}</span></p>
                  <p class="font-bold">Risk Rating: <span class="font-normal">${row["Risk Rating"]}</span></p>
                </div>`
              )
            )
            .addTo(map);
        }
      });
    }
  }, [map, data, selectedDecade]);

  return <div ref={mapContainer} style={{ width: "100%", height: "600px" }} />;
};

export default Map;
