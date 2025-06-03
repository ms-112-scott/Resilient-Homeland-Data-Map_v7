// src/modules/layers/streamVideoLayer.js

import {
  changeVideoSource,
  changeInfoCoordinate,
  changeInfoDate,
  changeInfoDataTitle,
} from "../utils/mediaUpdater.js";
import { openSidebar } from "../utils/sidebar.js";

export function loadStreamVideoLayer(map) {
  map.loadImage("public/images/pin_VideoCamera_v5.png", (error, image) => {
    if (error) throw error;

    map.addImage("stream-custom-marker", image);

    map.addSource("video_points", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            geometry: {
              type: "Point",
              coordinates: [120.95911, 22.50725],
            },
            properties: {
              title: "台東 多良車站",
              time: "live streaming",
              videourl:
                "https://www.youtube.com/embed/UCG1aXVO8H8?autoplay=1&mute=1&modestbranding=1&loop=1&vq=hd1080",
            },
          },
        ],
      },
    });

    map.addLayer({
      id: "video_points",
      type: "symbol",
      source: "video_points",
      layout: {
        "icon-image": "stream-custom-marker",
        "icon-size": 0.4,
        "text-field": ["get", "title"],
        "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
        "text-offset": [0, 2.25],
        "text-anchor": "top",
        "text-size": ["step", ["zoom"], 0, 9, 12],
      },
      paint: {
        "text-color": "#3f467a",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
      },
    });

    map.on("click", "video_points", (e) => {
      const feature = e.features[0];

      map.flyTo({
        center: feature.geometry.coordinates,
        padding: { left: 300 },
        duration: 1200,
        essential: true,
      });

      changeVideoSource(feature.properties.videourl);
      changeInfoCoordinate(formatCoords(feature.geometry.coordinates));
      changeInfoDate(feature.properties.time);
      changeInfoDataTitle(feature.properties.title);

      openSidebar(map, "infoContent", 14);
    });

    map.on("mouseenter", "video_points", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "video_points", () => {
      map.getCanvas().style.cursor = "";
    });
  });
}

function formatCoords(coords) {
  return coords.map((x) => x.toFixed(2)).join(", ");
}
