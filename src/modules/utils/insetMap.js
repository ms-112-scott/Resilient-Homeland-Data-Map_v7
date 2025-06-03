// src/modules/utils/insetMap.js

let initLoad = true;

/**
 * 取得主地圖邊界並更新小地圖邊界框圖層
 * @param {mapboxgl.Map} mainMap 主地圖
 * @param {mapboxgl.Map} insetMap 小地圖
 */
export function getInsetBounds(mainMap, insetMap) {
  const bounds = mainMap.getBounds();

  const boundsJson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [bounds._sw.lng, bounds._sw.lat],
              [bounds._ne.lng, bounds._sw.lat],
              [bounds._ne.lng, bounds._ne.lat],
              [bounds._sw.lng, bounds._ne.lat],
              [bounds._sw.lng, bounds._sw.lat],
            ],
          ],
        },
      },
    ],
  };

  if (initLoad) {
    addInsetLayer(insetMap, boundsJson); // 第一次建立圖層
    initLoad = false;
  } else {
    updateInsetLayer(insetMap, boundsJson); // 後續更新資料
  }
}

/**
 * 加入小地圖邊界框圖層（僅初次呼叫）
 * @param {mapboxgl.Map} insetMap 小地圖
 * @param {GeoJSON} bounds 邊界 GeoJSON
 */
export function addInsetLayer(insetMap, bounds) {
  insetMap.addSource("boundsSource", {
    type: "geojson",
    data: bounds,
  });

  insetMap.addLayer({
    id: "boundsLayer",
    type: "fill",
    source: "boundsSource",
    paint: {
      "fill-color": "#fff",
      "fill-opacity": 0.2,
    },
  });

  insetMap.addLayer({
    id: "outlineLayer",
    type: "line",
    source: "boundsSource",
    paint: {
      "line-color": "#000",
      "line-width": 1,
    },
  });
}

/**
 * 更新小地圖邊界框的資料（主地圖移動時呼叫）
 * @param {mapboxgl.Map} insetMap 小地圖
 * @param {GeoJSON} bounds 更新後的邊界
 */
export function updateInsetLayer(insetMap, bounds) {
  const source = insetMap.getSource("boundsSource");
  if (source) {
    source.setData(bounds);
  }
}
