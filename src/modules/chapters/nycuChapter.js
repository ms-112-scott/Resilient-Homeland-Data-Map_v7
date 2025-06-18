import { loadGeojsonSource } from "../source/loadGeojsonSource.js";
import { addPointLayer } from "../layers/addPointLayer.js";
import { mapOnEvents } from "../utils/mapOnEvents.js";

export function loadNycuChapter(map) {
  const chapterName = "nycu_photo";
  const sourceId = chapterName + "_source";
  const layerId = chapterName + "point_layer";
  const iconID = chapterName + "icon";

  //讀入資料來源
  loadGeojsonSource(map, {
    sourceId: sourceId,
    geojsonPath: "datasets/nycu_photo/2023_0321_183347_photo_Info.geojson",
  });

  //增加視覺化圖層
  addPointLayer(map, {
    layerId,
    sourceId,
    iconPath: "public/images/pin_image_v5.png",
    iconName: iconID,
  });

  mapOnEvents(map, layerId, "image");
}
