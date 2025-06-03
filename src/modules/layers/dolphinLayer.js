// src/modules/layers/dolphinLayer.js

import {
  changeVideoFileSource,
  changeInfoCoordinate,
  changeInfoDate,
  changeInfoDataTitle,
} from "../utils/mediaUpdater.js";
import { openSidebar } from "../utils/sidebar.js";

export function loadDolphinLayer(map) {
  map.loadImage("public/images/pin_dolphin_v5.png", (error, image) => {
    if (error) throw error;

    map.addImage("custom-marker_dolphin", image);

    map.addSource("video_points_dolphin", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [120.497185, 24.301337],
            },
            properties: {
              title: "白海豚空拍影像 1",
              videourl: "datasets/Dolphin/video/dp/dp-1.mp4",
              time: "",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [120.502185, 24.312337],
            },
            properties: {
              title: "白海豚空拍影像 2",
              videourl: "datasets/Dolphin/video/dp/dp-2.mp4",
              time: "",
            },
          },
        ],
      },
    });

    map.addLayer({
      id: "video_points_dolphin",
      type: "symbol",
      source: "video_points_dolphin",
      layout: {
        "icon-image": "custom-marker_dolphin",
        "icon-size": 0.4,
        "icon-allow-overlap": true,
        "text-field": ["get", "title"],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 2.25],
        "text-anchor": "top",
        "text-size": ["step", ["zoom"], 0, 9, 12],
      },
      paint: {
        "text-color": "#3d8589",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
      },
    });

    // 點擊事件
    map.on("click", "video_points_dolphin", (e) => {
      const feature = e.features[0];

      map.flyTo({
        center: feature.geometry.coordinates,
        padding: { left: 300 },
        duration: 1200,
        essential: true,
      });

      changeVideoFileSource(feature.properties.videourl);
      changeInfoCoordinate(formatCoords(feature.geometry.coordinates));
      changeInfoDate(feature.properties.time);
      changeInfoDataTitle(feature.properties.title);

      openSidebar(map, "infoContent", 12);
    });

    map.on("mouseenter", "video_points_dolphin", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "video_points_dolphin", () => {
      map.getCanvas().style.cursor = "";
    });
  });
}

function formatCoords(coords) {
  return coords.map((x) => x.toFixed(2)).join(", ");
}
