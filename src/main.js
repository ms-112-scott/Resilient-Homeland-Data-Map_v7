// src/main.js
import { setupStoryElements } from "./modules/init/setupStoryElements.js";
import { initializeMap } from "./modules/init/mapConfig.js";
import { setupScrollEvents } from "./modules/events/scrollEvents.js";

import { loadPhotoLayer } from "./modules/layers/photoLayer.js";
import { loadDolphinLayer } from "./modules/layers/dolphinLayer.js";
import { loadMiaoliDroneLayer } from "./modules/layers/miaoliDroneLayer.js";
import { loadDrone3DPathLayer } from "./modules/layers/drone3DPathLayer.js";
import { loadStreamVideoLayer } from "./modules/layers/streamVideoLayer.js";
import { load3DBuildingsLayer } from "./modules/layers/buildings3DLayer.js";

import config from "./config/config.js";

async function init() {
  // 初始化 HTML 結構 (header, footer, chapters)
  setupStoryElements(config);

  // 初始化地圖（主地圖 + 小地圖 + Threebox + sky）
  const { map, insetMap, tb } = await initializeMap(config);

  // 載入各類圖層（照片、影片、線資料等）
  loadPhotoLayer(map);
  loadDolphinLayer(map);
  loadMiaoliDroneLayer(map);
  loadDrone3DPathLayer(tb);
  loadStreamVideoLayer(map);
  load3DBuildingsLayer(map);

  // 初始化章節滾動互動（Scrollama）
  setupScrollEvents(map, insetMap, tb, config);
}

// 啟動整個應用
init();
