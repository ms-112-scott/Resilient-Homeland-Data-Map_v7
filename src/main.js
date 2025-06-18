// src/main.js
import { setupStoryElements } from "./modules/init/setupStoryElements.js";
import { initializeMap } from "./modules/init/mapConfig.js";
import { setupScrollEvents } from "./modules/events/scrollEvents.js";

// 匯入所有章節（僅初始化結構，尚未實作內容）
import { loadNycuChapter } from "./modules/chapters/nycuChapter.js";
import { loadDolphinChapter } from "./modules/chapters/dolphinChapter.js";
import { loadMiaoliDroneChapter } from "./modules/chapters/miaoliDroneChapter.js";
import { load3dDroneChapter } from "./modules/chapters/3dDroneChapter.js";
import { loadStreamChapter } from "./modules/chapters/streamChapter.js";

import { openSidebar, closedSidebar } from "./modules/utils/sidebar.js";
import config from "./config/config.js";
import { load3DBuildingsLayer } from "./modules/layers/buildings3DLayer.js";

async function init() {
  const { map, insetMap, tb } = await initializeMap(config);

  window.mainMap = map;

  window.closedSidebar = function (id) {
    closedSidebar(window.mainMap, id);
  };
  window.openSidebar = function (id, zoom) {
    if (!window.mainMap) return;
    openSidebar(window.mainMap, id, zoom);
  };

  setupStoryElements(config, map);

  // 章節初始化（尚未實作細節）
  loadNycuChapter(map);
  loadDolphinChapter(map);
  loadMiaoliDroneChapter(map);
  load3dDroneChapter(map, tb);
  loadStreamChapter(map);
  load3DBuildingsLayer(map);

  setupScrollEvents(map, insetMap, tb, config);
}

init().catch((err) => {
  console.error("初始化失敗：", err);
});
