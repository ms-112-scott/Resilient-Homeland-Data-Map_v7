// src/modules/utils/addPointLayer.js

/**
 * 在地圖上新增 symbol 圖層（icon + 文字）
 * @param {mapboxgl.Map} map - 地圖實例
 * @param {Object} options - 圖層選項
 * @param {string} options.layerId - 圖層 ID
 * @param {string} options.sourceId - 資料來源 ID（需先由 loadSource 載入）
 * @param {string} options.iconPath - 自訂 icon 圖片路徑
 * @param {string} options.iconName - 圖片名稱（唯一）
 * @param {string} [options.textField='title'] - 顯示文字的欄位
 * @param {number} [options.iconSize=0.4]
 * @param {string} [options.textColor='#8e6428']
 */
export function addPointLayer(
  map,
  {
    layerId,
    sourceId,
    iconPath,
    iconName,
    textField = "title",
    iconSize = 0.4,
    textColor = "#8e6428",
  }
) {
  map.loadImage(iconPath, (error, image) => {
    if (error) throw error;

    if (!map.hasImage(iconName)) {
      map.addImage(iconName, image);
    }

    if (!map.getLayer(layerId)) {
      map.addLayer({
        id: layerId,
        type: "symbol",
        source: sourceId,
        layout: {
          "icon-image": iconName,
          "icon-size": iconSize,
          "icon-allow-overlap": true,
          "text-field": ["get", textField],
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-allow-overlap": true,
          "text-offset": [0, 2.25],
          "text-anchor": "top",
          "text-size": ["step", ["zoom"], 0, 9, 12],
        },
        paint: {
          "text-color": textColor,
          "text-halo-color": "#ffffff",
          "text-halo-width": 1,
        },
      });
    }
  });
}
