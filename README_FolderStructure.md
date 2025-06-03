📁 Resilient-Homeland-Data-Map_v7
│
├── index.html # 主頁：地圖展示頁（type="module" 使用 src/main.js）
├── helper.html # 說明或外部參考頁面
├── README.md # 專案說明文件
│
├── 📁 datasets/ # 原始資料集（GeoJSON / txt / mp4 / youtube URLs）
│ ├── 📁 Dolphin/
│ ├── 📁 dronePath_demo/
│ ├── 📁 Miaoli_drone/
│ └── 📁 nycu_photo/
│
├── 📁 public/ # 靜態檔案
│ ├── 📁 css/
│ ├── 📁 fonts/
│ ├── 📁 images/
│ ├── 📁 images_readme/
│ └── drone_icon.svg
│
├── 📁 src/
│ ├── main.js ← 🔗 負責整合以下模組
│ │
│ ├── 📁 modules/
│ │ ├── 📁 init/
│ │ │ ├── setupStoryElements.js # HTML 結構初始化（header/footer/chapters）
│ │ │ └── mapConfig.js # 地圖初始化與語言/小地圖/3D 建立
│ │ │
│ │ ├── 📁 events/
│ │ │ └── scrollEvents.js # scrollama 滾動事件、章節切換
│ │ │
│ │ ├── 📁 layers/
│ │ │ ├── photoLayer.js # 校園照片圖層邏輯
│ │ │ ├── dolphinLayer.js # 白海豚影像圖層邏輯
│ │ │ ├── miaoliDroneLayer.js # 苗栗無人機路徑與影像圖層
│ │ │ ├── drone3DPathLayer.js # 群飛無人機 Threebox 路徑
│ │ │ ├── streamVideoLayer.js # 串流影像圖層（台東多良車站）
│ │ │ └── buildings3DLayer.js # Mapbox 內建 3D 建築圖層
│ │ │
│ │ └── 📁 utils/
│ │ ├── sidebar.js # 開/關側欄功能
│ │ ├── mediaUpdater.js # 圖片/影片切換功能
│ │ ├── helperFunctions.js # fetchFunction, createLineLayer, createThreejsLine 等工具
│ │ ├── insetMap.js # 小地圖邊界畫圖邏輯
│ │ └── layerOpacity.js # setLayerOpacity 相關函式
│ │
│ └── 📁 config/
│ ├── config.js # 章節、樣式、accessToken 等地圖設定
│ └── constants.js # 常數：顏色、樣式、語系
│
│
