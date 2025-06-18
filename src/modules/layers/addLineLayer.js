export function addLineLayer(map, line_data, line_name, color) {
  var sourceName = "route_" + line_name;
  map.addSource(sourceName, {
    type: "geojson",
    data: line_data,
  });
  map.addLayer({
    id: sourceName,
    type: "line",
    source: sourceName,
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": color,
      "line-width": 3,
    },
  });
}
