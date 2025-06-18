// src/modules/utils/loadGeojsonSource.js

/**
 * 載入 GeoJSON 資料來源到地圖
 * @param {mapboxgl.Map} map - 地圖實例
 * @param {string} sourceId - 資料來源 ID
 * @param {string} geojsonPath - GeoJSON 路徑或資料物件
 */
export function loadGeojsonSource(map, { sourceId, geojsonPath }) {
  if (!map.getSource(sourceId)) {
    map.addSource(sourceId, {
      type: "geojson",
      data: geojsonPath,
    });
  }
}
