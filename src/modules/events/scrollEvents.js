// src/modules/events/scrollEvents.js

const scroller = window.scrollama();
import { setLayerOpacity } from "../utils/layerOpacity.js";

import { closedSidebar } from "../utils/sidebar.js";

export function setupScrollEvents(map, insetMap, tb, config) {
  const scroller = scrollama();

  scroller
    .setup({
      step: ".step",
      offset: 0.5,
      progress: true,
    })
    .onStepEnter((response) => {
      const chapter = config.chapters.find((c) => c.id === response.element.id);
      response.element.classList.add("active");

      updateMiniNav(chapter.title);
      toggleElementsVisibility(chapter.id);
      updateMediaType(chapter.mediaType);
      resetMediaLoading();

      document.getElementById("projectTitle").innerHTML = chapter.title;
      document.getElementById("infotext-coordinate").innerHTML = "資料座標 ▸ ";
      document.getElementById("infotext-date").innerHTML = "拍攝日期 ▸ ";
      document.getElementById("infotext-datatitle").innerHTML = "資料標題 ▸ ";
      closedSidebar(map, "infoContent", chapter.location.zoom);

      const zoomed = { ...chapter.location, zoom: chapter.location.zoom + 0.3 };
      map[chapter.mapAnimation || "flyTo"](zoomed);

      if (config.inset) {
        const insetZoom = chapter.location.zoom < 5 ? 0 : 4;
        insetMap.flyTo({ center: chapter.location.center, zoom: insetZoom });
      }

      if (config.showMarkers && window.marker) {
        window.marker.setLngLat(chapter.location.center);
      }

      chapter.onChapterEnter?.forEach(setLayerOpacity);

      if (chapter.callback && typeof window[chapter.callback] === "function") {
        window[chapter.callback]();
      }

      if (chapter.rotateAnimation) {
        map.once("moveend", () => {
          const rotateNumber = map.getBearing();
          map.rotateTo(rotateNumber + 180, {
            duration: 100000,
            easing: (t) => t,
          });
        });
      }
    })
    .onStepExit((response) => {
      const chapter = config.chapters.find((c) => c.id === response.element.id);
      response.element.classList.remove("active");
      chapter.onChapterExit?.forEach(setLayerOpacity);
    });

  window.addEventListener("resize", scroller.resize);
}

function updateMiniNav(currentTitle) {
  const navItems = document.getElementsByClassName("nav-item");
  for (let item of navItems) {
    item.classList.toggle("active", item.innerHTML === currentTitle);
  }
}

function toggleElementsVisibility(chapterId) {
  const isFirst = chapterId === "first-identifier";

  document.getElementById("hero")?.classList.toggle("hide", !isFirst);
  document.getElementById("info")?.classList.toggle("hide", isFirst);
  document.getElementById("mapInset")?.classList.toggle("hidden", isFirst);
  document.getElementById("navbar")?.classList.toggle("hidden", isFirst);
}

function updateMediaType(mediaType) {
  const imageEl = document.getElementById("Imgcontent");
  const videoEl = document.getElementById("Videocontent");
  const fileVideoEl = document.getElementById("VideoFilecontent");

  if (mediaType === "video") {
    imageEl.classList.add("u-hidden");
    videoEl.classList.remove("u-hidden");
    fileVideoEl.classList.add("u-hidden");
  } else if (mediaType === "videoFile") {
    imageEl.classList.add("u-hidden");
    videoEl.classList.add("u-hidden");
    fileVideoEl.classList.remove("u-hidden");
  } else {
    videoEl.classList.add("u-hidden");
    imageEl.classList.remove("u-hidden");
    fileVideoEl.classList.add("u-hidden");
  }
}

function resetMediaLoading() {
  const loadingSrc = "public/images/info_loading.PNG";
  document.getElementById("Imgcontent").src = loadingSrc;
  document.getElementById("Videocontent").src = loadingSrc;
}
