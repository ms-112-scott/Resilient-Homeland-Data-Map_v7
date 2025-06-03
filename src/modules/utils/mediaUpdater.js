// src/modules/utils/mediaUpdater.js

export function changeImageSource(imgsrc) {
  document.getElementById("Imgcontent").src = imgsrc;
}

export function changeVideoSource(videosrc) {
  document.getElementById("Videocontent").src = videosrc;
}

export function changeVideoFileSource(videosrc) {
  const videoEl = document.getElementById("VideoFilecontent");
  document.getElementById("VideoFilecontent_Source").src = videosrc;
  videoEl.autoplay = true;
  videoEl.load();
}

export function changeInfoCoordinate(coord) {
  document.getElementById("infotext-coordinate").innerHTML =
    "資料座標 ▸ " + coord;
}

export function changeInfoDate(date) {
  document.getElementById("infotext-date").innerHTML = "拍攝日期 ▸ " + date;
}

export function changeInfoDataTitle(title) {
  document.getElementById("infotext-datatitle").innerHTML =
    "資料標題 ▸ " + title;
}
