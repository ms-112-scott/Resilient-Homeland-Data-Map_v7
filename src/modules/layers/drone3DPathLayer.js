// src/modules/layers/drone3DPathLayer.js

import { createThreejsLine } from "../utils/helperFunctions.js";

export function loadDrone3DPathLayer(tb) {
  const paths = [
    "datasets/dronePath_demo/2023_0409_170757_drone_path_0.txt",
    "datasets/dronePath_demo/2023_0409_170757_drone_path_1.txt",
    "datasets/dronePath_demo/2023_0409_170757_drone_path_2.txt",
  ];

  paths.forEach((path) => {
    createThreejsLine(path, tb, "#ffffff");
  });
}
