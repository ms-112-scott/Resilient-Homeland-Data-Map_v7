// src/modules/utils/helperFunctions.js

export function fetchFunction(url, callback) {
  fetch(url)
    .then((response) => {
      if (response.status === 200) return response.json();
    })
    .then((data) => callback(data));
}

export function createThreejsLine(url, tb, color = "#ffffff") {
  fetchFunction(url, (data) => {
    const coords = data.features[0].geometry.coordinates;
    const line = tb.line({
      geometry: coords,
      width: 2,
      color: color,
    });
    tb.add(line);
  });
}

export function createLineLayer(map, url, id, color = "#000000") {
  const sourceId = `route_${id}`;
  map.addSource(sourceId, {
    type: "geojson",
    data: url,
  });

  map.addLayer({
    id: sourceId,
    type: "line",
    source: sourceId,
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
