// src/modules/utils/mediaUpdater.js

// change info img
export function changeImageSource(imgsrc) {
  document.getElementById("Imgcontent").src = imgsrc;
}

// change info video
export function changeVideoSource(videosrc) {
  document.getElementById("Videocontent").src = videosrc;
}

// change info video
export function changeVideoFileSource(videosrc) {
  document.getElementById("VideoFilecontent_Source").src = videosrc;

  var x = document.getElementById("VideoFilecontent");
  x.autoplay = true;
  x.load();
}

// -------------------------------------------
// change coordinate
export function changeInfoCoordinate(coorsrc) {
  document.getElementById("infotext-coordinate").innerHTML =
    "資料座標 ▸ " + coorsrc;
}

// change time
export function changeInfoDate(timescr) {
  document.getElementById("infotext-date").innerHTML = "拍攝日期 ▸ " + timescr;
}

// change time
export function changeInfoDataTitle(timescr) {
  document.getElementById("infotext-datatitle").innerHTML =
    "資料標題 ▸ " + timescr;
}
