// src/modules/chapters/miaoliDroneChapter.js
import { loadGeojsonSource } from "../source/loadGeojsonSource.js";
import { addPointLayer } from "../layers/addPointLayer.js";
import { addLineLayer } from "../layers/addLineLayer.js";
import { mapOnEvents } from "../utils/mapOnEvents.js";

var miaoli_drone = [
  {
    dataPath:
      "datasets/Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1130_drone_path_0.txt",
    dataName: "miaoli_lineGeometry_0",
    color: "#ffffff",
  },
  {
    dataPath:
      "datasets/Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1154_drone_path_0.txt",
    dataName: "miaoli_lineGeometry_1",
    color: "#888888",
  },
  {
    dataPath:
      "datasets/Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1154_drone_path_1.txt",
    dataName: "miaoli_lineGeometry_2",
    color: "#333333",
  },
  {
    dataPath:
      "datasets/Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1441_drone_path_0.txt",
    dataName: "miaoli_lineGeometry_3",
    color: "#666666",
  },
  {
    dataPath:
      "datasets/Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1505_drone_path_0.txt",
    dataName: "miaoli_lineGeometry_4",
    color: "#000000",
  },
];

export function loadMiaoliDroneChapter(map) {
  const chapterName = "miaoliDrone";
  const sourceId = chapterName + "_source";
  const layerId = chapterName + "point_layer";
  const iconID = chapterName + "icon";

  //讀入資料來源
  loadGeojsonSource(map, {
    sourceId: sourceId,
    geojsonPath: "datasets/Miaoli_drone/miaoli_drone.geojson",
  });

  //增加視覺化圖層
  miaoli_drone.map((e) => {
    addLineLayer(map, e.dataPath, e.dataName, e.color);
  });

  addPointLayer(map, {
    layerId,
    sourceId,
    iconPath: "public/images/pin_drone_v5.png",
    iconName: iconID,
  });

  mapOnEvents(map, layerId, "videoApi");
}
