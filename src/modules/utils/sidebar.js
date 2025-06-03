// src/modules/utils/sidebar.js

export function closedSidebar(map, id, zoom = 0) {
  const elem = document.getElementById(id);
  elem.classList.add("collapsed");

  const padding = { left: 0 };
  const adjustedZoom = zoom === 0 ? map.getZoom() + 0.3 : zoom + 0.3;

  map.easeTo({
    padding,
    zoom: adjustedZoom,
    duration: 1000,
  });
}

export function openSidebar(map, id, zoom) {
  const elem = document.getElementById(id);
  elem.classList.remove("collapsed");

  const padding = { left: 300 };

  map.easeTo({
    padding,
    zoom,
    duration: 1000,
  });
}
