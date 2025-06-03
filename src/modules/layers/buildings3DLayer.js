// src/modules/layers/buildings3DLayer.js

export function load3DBuildingsLayer(map) {
  map.on("load", () => {
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
      (l) => l.type === "symbol" && l.layout && l.layout["text-field"]
    )?.id;

    if (!labelLayerId) return;

    map.addLayer(
      {
        id: "add-3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 15,
        paint: {
          "fill-extrusion-color": "#ffffff",
          "fill-extrusion-height": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "height"],
          ],
          "fill-extrusion-base": [
            "interpolate",
            ["linear"],
            ["zoom"],
            15,
            0,
            15.05,
            ["get", "min_height"],
          ],
          "fill-extrusion-opacity": 0.6,
        },
      },
      labelLayerId
    );
  });
}
