// src/modules/init/mapConfig.js

import { getInsetBounds, addInsetLayer } from "../utils/insetMap.js";

// 地圖主物件、三維插件、內嵌地圖將從此模組輸出
let map, insetMap, tb;

/**
 * 初始化主地圖與小地圖（含 Threebox、語言切換、3D 地形、Sky layer 等）
 * @param {*} config 從 config.js 匯入的設定檔
 * @returns { map, insetMap, tb } 可供外部使用
 */
export async function initializeMap(config) {
  // 設定 Mapbox API 金鑰（請於 config.js 中填入）
  mapboxgl.accessToken = config.accessToken;

  // 加入 URL 追蹤字串以利辨識資料載入來源（pluginName）
  const transformRequest = (url) => {
    const hasQuery = url.indexOf("?") !== -1;
    const suffix = hasQuery
      ? "&pluginName=scrollytellingV2"
      : "?pluginName=scrollytellingV2";
    return { url: url + suffix };
  };

  // 建立主地圖（參考第一章節資訊）
  map = new mapboxgl.Map({
    container: "map",
    style: config.style,
    center: config.chapters[0].location.center,
    zoom: config.chapters[0].location.zoom,
    bearing: config.chapters[0].location.bearing,
    pitch: config.chapters[0].location.pitch,
    projection: config.projection,
    interactive: true,
    transformRequest: transformRequest,
  });

  // 建立小地圖（右下角顯示 overview）
  if (config.inset) {
    insetMap = new mapboxgl.Map({
      container: "mapInset",
      style: "mapbox://styles/mapbox/outdoors-v10",
      center: config.chapters[0].location.center,
      zoom: 4,
      hash: false,
      interactive: false,
      attributionControl: false,
    });
  }

  // 顯示章節 marker（若啟用）
  if (config.showMarkers) {
    window.marker = new mapboxgl.Marker({ color: config.markerColor });
    window.marker.setLngLat(config.chapters[0].location.center).addTo(map);
  }

  // 地圖載入完成後進一步設定
  await new Promise((resolve) =>
    map.on("load", () => {
      // 地圖文字顯示英文（可改為繁體中文，需整合語言切換插件）
      const labels = [
        "country-label",
        "state-label",
        "settlement-subdivision-label",
        "airport-label",
        "poi-label",
        "water-point-label",
        "water-line-label",
        "natural-point-label",
        "natural-line-label",
        "waterway-label",
        "road-label",
        "continent-label",
        "settlement-major-label",
        "settlement-minor-label",
        "transit-label",
        "ferry-aerialway-label",
        "golf-hole-label",
        "path-pedestrian-label",
        "building-number-label",
        "block-number-label",
      ];
      labels.forEach((label) => {
        map.setLayoutProperty(label, "text-field", ["get", "name_en"]);
      });

      // 加入 3D 地形與天空層
      if (config.use3dTerrain) {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 0.0],
            "sky-atmosphere-sun-intensity": 15,
          },
        });
      }

      // Threebox 初始化（3D 元件容器）
      map.addLayer({
        id: "custom_layer",
        type: "custom",
        renderingMode: "3d",
        onAdd: function (map, mbxContext) {
          window.tb = new Threebox(map, mbxContext, {
            defaultLights: true,
            enableSelectingFeatures: true,
            enableSelectingObjects: true,
            enableDraggingObjects: true,
            enableRotatingObjects: true,
            enableTooltips: true,
          });
          tb = window.tb;
        },
        render: function () {
          tb.update();
        },
      });

      // 小地圖邊界同步更新
      if (config.inset) {
        map.on("move", () => getInsetBounds(map, insetMap));
      }

      resolve();
    })
  );

  return { map, insetMap, tb };
}
