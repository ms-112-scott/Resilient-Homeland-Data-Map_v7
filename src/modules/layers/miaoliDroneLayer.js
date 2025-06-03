// src/modules/layers/miaoliDroneLayer.js

import {
  changeVideoSource,
  changeInfoCoordinate,
  changeInfoDate,
  changeInfoDataTitle,
} from "../utils/mediaUpdater.js";
import { openSidebar } from "../utils/sidebar.js";
import { createLineLayer } from "../utils/helperFunctions.js";

export function loadMiaoliDroneLayer(map) {
  const linePaths = [
    {
      url: "datasets/Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1130_drone_path_0.txt",
      id: "miaoli_lineGeometry_0",
      color: "#ffffff",
    },
    {
      url: "datasets/Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1154_drone_path_0.txt",
      id: "miaoli_lineGeometry_1",
      color: "#888888",
    },
    {
      url: "datasets/Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1154_drone_path_1.txt",
      id: "miaoli_lineGeometry_2",
      color: "#333333",
    },
    {
      url: "datasets/Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1441_drone_path_0.txt",
      id: "miaoli_lineGeometry_3",
      color: "#666666",
    },
    {
      url: "datasets/Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1505_drone_path_0.txt",
      id: "miaoli_lineGeometry_4",
      color: "#000000",
    },
  ];

  linePaths.forEach(({ url, id, color }) => {
    createLineLayer(map, url, id, color);
  });

  map.loadImage("public/images/pin_drone_v5.png", (error, image) => {
    if (error) throw error;

    map.addImage("custom-marker_miaoli", image);

    map.addSource("video_points_miaoli", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            geometry: { type: "Point", coordinates: [120.879545, 24.538407] },
            properties: {
              title: "路徑1",
              time: "2023_0316_1130",
              videourl:
                "https://www.youtube.com/embed/E2DbnCGL63g?autoplay=1&mute=1&modestbranding=1&loop=1",
            },
          },
          {
            geometry: {
              type: "Point",
              coordinates: [120.8863807, 24.53765926],
            },
            properties: {
              title: "路徑2",
              time: "2023_0316_1154",
              videourl:
                "https://www.youtube.com/embed/P810d4VNdzw?autoplay=1&mute=1&modestbranding=1&loop=1",
            },
          },
          {
            geometry: {
              type: "Point",
              coordinates: [120.8800277, 24.53879649],
            },
            properties: {
              title: "路徑3",
              time: "2023_0316_1441",
              videourl:
                "https://www.youtube.com/embed/stc-bRSqmUM?autoplay=1&mute=1&modestbranding=1&loop=1",
            },
          },
          {
            geometry: { type: "Point", coordinates: [120.886057, 24.53799016] },
            properties: {
              title: "路徑4",
              time: "2023_0316_1505",
              videourl:
                "https://www.youtube.com/embed/IFKbZxpYIiA?autoplay=1&mute=1&modestbranding=1&loop=1",
            },
          },
        ],
      },
    });

    map.addLayer({
      id: "video_points_miaoli",
      type: "symbol",
      source: "video_points_miaoli",
      layout: {
        "icon-image": "custom-marker_miaoli",
        "icon-size": 0.4,
        "icon-allow-overlap": true,
        "text-field": ["get", "title"],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-allow-overlap": true,
        "text-offset": [0, 2.25],
        "text-anchor": "top",
        "text-size": ["step", ["zoom"], 0, 9, 12],
      },
      paint: {
        "text-color": "#728c2c",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
      },
    });

    map.on("click", "video_points_miaoli", (e) => {
      const feature = e.features[0];
      map.flyTo({
        center: [120.881246, 24.539507],
        duration: 1200,
        essential: true,
      });

      changeVideoSource(feature.properties.videourl);
      changeInfoCoordinate(formatCoords(feature.geometry.coordinates));
      changeInfoDate(feature.properties.time);
      changeInfoDataTitle(feature.properties.title);
      openSidebar(map, "infoContent", 16);
    });

    map.on("mouseenter", "video_points_miaoli", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "video_points_miaoli", () => {
      map.getCanvas().style.cursor = "";
    });
  });
}

function formatCoords(coords) {
  return coords.map((x) => x.toFixed(2)).join(", ");
}
