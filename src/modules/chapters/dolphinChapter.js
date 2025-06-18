// src/modules/chapters/dolphinLayer.js
import { loadGeojsonSource } from "../source/loadGeojsonSource.js";
import { addPointLayer } from "../layers/addPointLayer.js";
import { mapOnEvents } from "../utils/mapOnEvents.js";

export async function loadDolphinChapter(map) {
  const chapterName = "Dolphin";
  const sourceId = chapterName + "_source";
  const layerId = chapterName + "point_layer";
  const iconID = chapterName + "icon";

  //讀入資料來源
  loadGeojsonSource(map, {
    sourceId: sourceId,
    geojsonPath: "datasets/Dolphin/video/dp/dolphin_data.geojson",
  });

  //增加視覺化圖層
  addPointLayer(map, {
    layerId,
    sourceId,
    iconPath: "public/images/pin_dolphin_v5.png",
    iconName: iconID,
  });

  mapOnEvents(map, layerId, "videoLocal");
}
