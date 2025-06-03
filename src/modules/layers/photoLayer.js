// src/modules/layers/photoLayer.js

import {
  changeImageSource,
  changeInfoCoordinate,
  changeInfoDate,
  changeInfoDataTitle,
} from "../utils/mediaUpdater.js";
import { openSidebar } from "../utils/sidebar.js";

export function loadPhotoLayer(map) {
  map.loadImage("public/images/pin_image_v5.png", (error, image) => {
    if (error) throw error;

    map.addImage("custom-marker_nycuphoto", image);

    map.addSource("image_points_nycuphoto", {
      type: "geojson",
      data: "datasets/nycu_photo/2023_0321_183347_photo_location.txt",
    });

    map.addLayer({
      id: "image_points_nycuphoto",
      type: "symbol",
      source: "image_points_nycuphoto",
      layout: {
        "icon-image": "custom-marker_nycuphoto",
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
        "text-color": "#8e6428",
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
      },
    });

    // 點擊事件
    map.on("click", "image_points_nycuphoto", (e) => {
      const feature = e.features[0];

      map.flyTo({
        center: feature.geometry.coordinates,
        padding: { left: 300 },
        duration: 1200,
        essential: true,
      });

      changeImageSource(feature.properties.imgurl);
      changeInfoCoordinate(formatCoords(feature.geometry.coordinates));
      changeInfoDate(feature.properties.time);
      changeInfoDataTitle(feature.properties.title);

      openSidebar(map, "infoContent", 15.5);
    });

    map.on("mouseenter", "image_points_nycuphoto", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "image_points_nycuphoto", () => {
      map.getCanvas().style.cursor = "";
    });
  });
}

function formatCoords(coords) {
  return coords.map((x) => x.toFixed(2)).join(", ");
}
