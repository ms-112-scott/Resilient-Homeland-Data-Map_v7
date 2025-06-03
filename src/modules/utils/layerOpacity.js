// src/modules/utils/layerOpacity.js

export const layerTypes = {
  fill: ["fill-opacity"],
  line: ["line-opacity"],
  circle: ["circle-opacity", "circle-stroke-opacity"],
  symbol: ["icon-opacity", "text-opacity"],
  raster: ["raster-opacity"],
  "fill-extrusion": ["fill-extrusion-opacity"],
  heatmap: ["heatmap-opacity"],
};

export function getLayerPaintType(layerId) {
  const layer = map.getLayer(layerId);
  if (!layer) return [];
  return layerTypes[layer.type] || [];
}

export function setLayerOpacity(layerObj) {
  const props = getLayerPaintType(layerObj.layer);
  props.forEach((prop) => {
    const options = layerObj.duration ? { duration: layerObj.duration } : {};
    const transition = prop + "-transition";
    if (layerObj.duration) {
      map.setPaintProperty(layerObj.layer, transition, options);
    }
    map.setPaintProperty(layerObj.layer, prop, layerObj.opacity, options);
  });
}
