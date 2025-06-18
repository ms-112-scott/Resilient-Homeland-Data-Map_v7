// src/modules/chapters/miaoliDroneChapter.js
import { addThreejsLine } from "../layers/addThreejsLine.js";
import { mapOnEvents } from "../utils/mapOnEvents.js";

var miaoli_drone = [
  {
    dataPath: "datasets/dronePath_demo/2023_0409_170757_drone_path_0.txt",
    dataName: "ur_lineGeometry_0",
    color: "#ffffff",
  },
  {
    dataPath: "datasets/dronePath_demo/2023_0409_170757_drone_path_1.txt",
    dataName: "ur_lineGeometry_1",
    color: "#ffffff",
  },
  {
    dataPath: "datasets/dronePath_demo/2023_0409_170757_drone_path_2.txt",
    dataName: "ur_lineGeometry_2",
    color: "#ffffff",
  },
];

export function load3dDroneChapter(map, tb) {
  const chapterName = "3dDroneChapter";
  const sourceId = chapterName + "_source";
  const layerId = chapterName + "point_layer";
  const iconID = chapterName + "icon";

  //增加視覺化圖層
  miaoli_drone.map((e) => {
    addThreejsLine(e.dataPath, tb, e.color);
  });

  mapOnEvents(map, layerId, "videoApi");
}
