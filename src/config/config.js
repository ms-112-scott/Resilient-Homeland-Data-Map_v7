// src/config/config.js

export default {
  // Mapbox 樣式與授權設定
  style: "mapbox://styles/yunchen-lee/clsvlegso000y01oic95c3egs", // 自訂樣式（隱藏 shield）
  accessToken:
    "pk.eyJ1IjoieXVuY2hlbi1sZWUiLCJhIjoiY2wxeGttYmg0MDNwaTNicWY5bWM5ZHM0OCJ9.gS5S-DMTk308nQP8MAzN0w", // 使用者 token

  // 互動與顯示設定
  showMarkers: false, // 是否顯示預設 marker
  markerColor: "#1e9696", // Marker 顏色
  inset: true, // 是否啟用小地圖
  theme: "dark", // 主題樣式（dark/light）
  use3dTerrain: true, // 啟用 3D 地形
  projection: "globe", // 投影方式（預設為地球）

  // 頁面標頭內容
  title: "Projects",
  subtitle: "... subtitle ...",
  byline: "By ...",
  footer:
    '&copy; National Yang Ming Chiao Tung University. Created using <a href="https://github.com/mapbox/storytelling" target="_blank">Mapbox Storytelling</a> template.',

  // 各章節定義（對應 scrollama）
  chapters: [
    {
      id: "first-identifier",
      alignment: "left",
      hidden: false,
      title: "",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      location: {
        center: [120.38, 23.9],
        zoom: 6.8,
        pitch: 0,
        bearing: 0,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [],
      onChapterExit: [],
      mediaType: "none",
    },
    {
      id: "second-identifier",
      alignment: "left",
      hidden: false,
      title: "交大實景拍攝影像",
      description: "Copy these sections to add to your story.",
      location: {
        center: [120.9958, 24.7867],
        zoom: 15.5,
        pitch: 26,
        bearing: 0,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [],
      onChapterExit: [],
      mediaType: "image",
    },
    {
      id: "third-identifier",
      alignment: "left",
      hidden: false,
      title: "空拍分析影像 白海豚",
      description: "拍攝標的物為白海豚...附兩段空拍影像供標註使用。",
      location: {
        center: [120.470185, 24.311337],
        zoom: 12,
        pitch: 0,
        bearing: 0,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [],
      onChapterExit: [],
      mediaType: "videoFile",
    },
    {
      id: "fourth-identifier",
      alignment: "left",
      hidden: false,
      title: "無人機苗栗山區道路自主導航",
      description:
        "使用無人機進行苗栗山區道路自主導航...影片已上傳至 YouTube。",
      location: {
        center: [120.881246, 24.539507],
        zoom: 16,
        pitch: 20,
        bearing: 40,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [],
      onChapterExit: [],
      mediaType: "video",
    },
    {
      id: "sixth-identifier",
      alignment: "left",
      hidden: false,
      title: "群飛路徑視覺化測試資料",
      description: "Copy these sections to add to your story.",
      location: {
        center: [121.318873, 23.589414],
        zoom: 14.5,
        pitch: 30,
        bearing: -60.0,
      },
      mapAnimation: "flyTo",
      rotateAnimation: true,
      callback: "",
      onChapterEnter: [],
      onChapterExit: [],
      mediaType: "none",
    },
    {
      id: "seventh-identifier",
      alignment: "left",
      hidden: false,
      title: "台東多良車站即時影像",
      description: "Taitung Amazing",
      location: {
        center: [120.96311, 22.50725],
        zoom: 14,
        pitch: 52,
        bearing: 180,
      },
      mapAnimation: "flyTo",
      rotateAnimation: false,
      callback: "",
      onChapterEnter: [],
      onChapterExit: [],
      mediaType: "video",
    },
  ],
};
