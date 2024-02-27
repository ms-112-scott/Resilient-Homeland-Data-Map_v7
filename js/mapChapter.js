// Project: Resilient-Homeland-Data-Map_v7
// Contributed by: NYCU, IAR, GIAAIL 
// Created using https://github.com/mapbox/storytelling Mapbox Storytelling template.
// Last edited time: 2023/07/20
// Last edited by: Yun-Chen Lee yclee@arch.nycu.edu.tw
// Source code and documentation: https://github.com/GIAAIL/Resilient-Homeland-Data-Map_v7 
// -----------------------------------------------------------------------------------------
// 可調整/需調整的部分統一以 "//#" 開頭註解說明

// ===========================================================
// /* Storytelling Template 基礎設定，無須修改 */
// ===========================================================
var initLoad = true;
var layerTypes = {
    'fill': ['fill-opacity'],
    'line': ['line-opacity'],
    'circle': ['circle-opacity', 'circle-stroke-opacity'],
    'symbol': ['icon-opacity', 'text-opacity'],
    'raster': ['raster-opacity'],
    'fill-extrusion': ['fill-extrusion-opacity'],
    'heatmap': ['heatmap-opacity']
}
var alignments = {
    'left': 'lefty',
    'center': 'centered',
    'right': 'righty',
    'full': 'fully'
}

function getLayerPaintType(layer) {
    var layerType = map.getLayer(layer).type;
    return layerTypes[layerType];
}

function setLayerOpacity(layer) {
    var paintProps = getLayerPaintType(layer.layer);
    paintProps.forEach(function(prop) {
        var options = {};
        if (layer.duration) {
            var transitionProp = prop + "-transition";
            options = { "duration": layer.duration };
            map.setPaintProperty(layer.layer, transitionProp, options);
        }
        map.setPaintProperty(layer.layer, prop, layer.opacity, options);
    });
}

// ===========================================================
// /* HTML 元素建立與設定，無須修改 */
// ===========================================================
// HTML 元素初始化
var story = document.getElementById('story'); // 抓取 <div id="story"></div> 此區塊元素
var features = document.createElement('div'); // 創建新區塊元素，供後續放置所有章節
features.setAttribute('id', 'features'); // 設定新區塊元素 id 為 features 
var header = document.createElement('div'); // 創建新區塊元素，後續將置於所有章節之前
var footer = document.createElement('div'); // 創建新區塊元素，後續江置於所有章節之後

// 根據 config.js 設定 header
//# header 內容請至 config.js 修改
// ---- create header ---- //
if (config.title) { // 首頁標題(本專案沒有使用)
    var titleText = document.createElement('h1');
    titleText.innerText = config.title;
    header.appendChild(titleText);
}
if (config.subtitle) { // 首頁副標題(本專案沒有使用)
    var subtitleText = document.createElement('h2');
    subtitleText.innerText = config.subtitle;
    header.appendChild(subtitleText);
}
if (config.byline) { // 首頁說明(本專案沒有使用)
    var bylineText = document.createElement('p');
    bylineText.innerText = config.byline;
    header.appendChild(bylineText);
}
// 將 header 加入到 story 的最前面
if (header.innerText.length > 0) {
    header.classList.add(config.theme);
    header.setAttribute('id', 'header');
    story.appendChild(header);
}

// 根據 config.js 將所有章節(chapters)批次建立
//# 章節資訊內容請至 config.js 修改
// ---- create chapters ---- //
config.chapters.forEach((record, idx) => {
    var container = document.createElement('div');
    var chapter = document.createElement('div');

    // 每個章節的附加資訊(本專案沒有使用)
    // if (record.title) {  // 章節標題
    //     var title = document.createElement('h3');
    //     title.innerText = record.title;
    //     chapter.appendChild(title);
    // }

    // if (record.image) {  // 章節圖片
    //     var image = new Image();
    //     image.src = record.image;
    //     chapter.appendChild(image);
    // }

    // if (record.description) {  // 章節介紹
    //     var story = document.createElement('p');
    //     story.innerHTML = record.description;
    //     chapter.appendChild(story);
    // }

    container.setAttribute('id', record.id);
    container.classList.add('step');
    if (idx === 0) {
        container.classList.add('active');
    }

    chapter.classList.add(config.theme);
    container.appendChild(chapter);
    container.classList.add(alignments[record.alignment] || 'centered');
    if (record.hidden) {
        container.classList.add('hidden');
    }
    features.appendChild(container);
});

story.appendChild(features);

// 根據 config.js 建立 footer
//# footer 內容請至 config.js 修改
// ---- create footer ---- //
if (config.footer) {
    var footerText = document.createElement('p');
    footerText.innerHTML = config.footer;
    footer.appendChild(footerText);
}

if (footer.innerText.length > 0) {
    footer.classList.add(config.theme);
    footer.setAttribute('id', 'footer');
    story.appendChild(footer);
}


// ===========================================================
// /* Mapbox 地圖建立前的基礎設定 */
// ===========================================================
// ---- set mapbox API key --- //
//# 請至 config.js 填寫 api key
mapboxgl.accessToken = config.accessToken;

// 建立 Mapbox 地圖 
// ---- create map(main) ----
const transformRequest = (url) => {
    const hasQuery = url.indexOf("?") !== -1;
    const suffix = hasQuery ? "&pluginName=scrollytellingV2" : "?pluginName=scrollytellingV2";
    return {
        url: url + suffix
    }
}

// 地圖初始設定
// 相關參數請參考 https://docs.mapbox.com/mapbox-gl-js/api/map/#map
var map = new mapboxgl.Map({
    container: 'map',
    style: config.style, //# 請至 config.js 修改地圖樣式

    //# 抓取第一章節的地圖資訊，章節資訊請至 config.js 修改
    center: config.chapters[0].location.center, // 地圖中心
    zoom: config.chapters[0].location.zoom, // 地圖縮放尺寸
    bearing: config.chapters[0].location.bearing, // 地圖仰角
    pitch: config.chapters[0].location.pitch, // 地圖旋轉方位
    projection: config.projection,

    interactive: true, // 是否可用滑鼠拖拉或縮放地圖
    // interactive: false,
    // scrollZoom: false
    transformRequest: transformRequest,
});


// 建立右下角的小地圖
// ---- create a inset map if enabled in config.js ---- //
//# 是否要有小地圖可至 config.js 修改
if (config.inset) {
    var insetMap = new mapboxgl.Map({
        container: 'mapInset', // container id
        style: 'mapbox://styles/mapbox/outdoors-v10', //# 小地圖樣式
        center: config.chapters[0].location.center,
        zoom: 4, //# 小地圖縮放尺寸
        hash: false,
        interactive: false, // 是否可用滑鼠拖拉或縮放地圖
        attributionControl: false,
    });
}


// 標示章節中心座標(本專案沒有使用)
// ---- create a marker at chapters' center location if enabled in config.js ---- //
if (config.showMarkers) {
    var marker = new mapboxgl.Marker({ color: config.markerColor });
    marker.setLngLat(config.chapters[0].location.center).addTo(map);
}


// 初始化滑鼠滾動偵測功能
// ---- instantiate the scrollama ---- //
var scroller = scrollama();


// ===========================================================
// /* Mapbox 地圖建立(+新增圖層與資料集) */
// ===========================================================
map.on("load", function() {

    // 更改語言
    // ---- set language  ---- //
    let labels = ['country-label', 'state-label',
        'settlement-subdivision-label',
        'airport-label', 'poi-label', 'water-point-label',
        'water-line-label', 'natural-point-label',
        'natural-line-label', 'waterway-label', 'road-label', 'continent-label', 'settlement-major-label', 'settlement-minor-label', 'transit-label', 'ferry-aerialway-label', 'golf-hole-label', 'path-pedestrian-label', 'building-number-label', 'block-number-label'
    ];

    //# 選擇一：英文 
    labels.forEach(label => {
        map.setLayoutProperty(label, 'text-field', ['get', 'name_en']);
    });

    // //# 選擇一：中文 
    // labels.forEach(label => {
    //     map.setLayoutProperty(label, 'text-field', ['get', 'name_zh-Hant']);
    // });

    // //# 選擇三：中英
    // labels.forEach(label => {
    //     map.setLayoutProperty(label, 'text-field', [
    //         'format', ['get', 'name_en'],
    //         { 'font-scale': 1.2 },
    //         '\n',
    //         {},
    //         ['get', 'name'],
    //         {
    //             'font-scale': 0.8,
    //             'text-font': [
    //                 'literal', ['DIN Offc Pro Italic', 'Arial Unicode MS Regular']
    //             ]
    //         }
    //     ]); // name_zh-Hant
    // });


    // 建立地形圖
    // ---- set 3d terrain ---- //
    if (config.use3dTerrain) {
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        // 設定天空樣式
        // add a sky layer that will show when the map is highly pitched
        map.addLayer({
            'id': 'sky',
            'type': 'sky',
            'paint': {
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 0.0],
                'sky-atmosphere-sun-intensity': 15
            }
        });
    };


    //# 自動建立右側迷你選單，迷你選單樣式請至 style.css 修改
    // ---- create chapter nav html elem ---- //
    config.chapters.forEach(c => {
        if (c.id != 'first-identifier') { // 除了首頁都要建立迷你選單
            var a = document.createElement('a');
            var linkText = document.createTextNode(c.title);
            a.classList.add("nav-item")
            a.appendChild(linkText);
            a.href = "#" + c.id;
            a.onclick = function() { // 每次點擊選單的時候會飛到該章節
                // console.log(c.location.center)
                map.flyTo({
                    center: c.location.center,
                    zoom: c.location.zoom,
                    pitch: c.location.pitch,
                    bearing: c.location.bearing,
                    essential: true,
                    padding: {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0
                    },
                    duration: 1200 // 動畫時長
                });

            }
            document.getElementById("navbar").appendChild(a);
        }

    })


    // 章節切換事件設定
    // ---- As the map moves, grab and update bounds in inset map. ---- //
    if (config.inset) {
        map.on('move', getInsetBounds);
    }
    // setup the instance, pass callback functions
    scroller
        .setup({
            step: '.step',
            offset: 0.5,
            progress: true
        })
        .onStepEnter(async response => {
            var chapter = config.chapters.find(chap => chap.id === response.element.id); // 取得當前章節編號
            response.element.classList.add('active'); // 將當前章節設置為 active

            // 將當前章節的迷你選單設定為藍色，其他設定為灰色
            // active chapter nav html elem ------------------------------------------------------
            var obj = document.getElementsByClassName("nav-item");
            for (let item of obj) {
                // console.log(item.innerHTML);
                if (chapter.title == item.innerHTML) item.classList.add("active")
                else { item.classList.remove("active"); }
            }

            // 只有第一章節顯示封面標題(Resilient Homeland Data Map)
            // toggle hero card
            const elem_hero = document.getElementById('hero');
            if (chapter.id === "first-identifier") {
                elem_hero.classList.remove('hide');
            } else elem_hero.classList.add('hide');

            // 只有第一章節不顯示章節標題
            // toggle info card
            const elem_info = document.getElementById('info');
            if (chapter.id === "first-identifier") {
                elem_info.classList.add('hide');
            } else elem_info.classList.remove('hide');

            // 只有第一章節不顯示小地圖
            // toggle mapInset
            const elem_inset = document.getElementById('mapInset');
            if (chapter.id === "first-identifier") {
                elem_inset.classList.add('hidden');
            } else elem_inset.classList.remove('hidden');

            // 只有第一章節不顯示迷你選單
            // toggle nav
            const elem_nav = document.getElementById('navbar');
            if (chapter.id === "first-identifier") {
                elem_nav.classList.add('hidden');
            } else elem_nav.classList.remove('hidden');

            // 依據在 config.js 設定的章節檔案類型更改 HTML 元素，以符合：圖片連結、影片連結、影片檔案，這三種格式
            // ---- toggle media type ---- //
            const elem_mediaImg = document.getElementById('Imgcontent')
            const elem_mediaVideo = document.getElementById('Videocontent')
            const elem_mediaVideoFile = document.getElementById('VideoFilecontent')
            if (chapter.mediaType === 'video') {
                elem_mediaImg.classList.add('u-hidden');
                elem_mediaVideo.classList.remove('u-hidden');
                elem_mediaVideoFile.classList.add('u-hidden');
            } else if (chapter.mediaType === 'videoFile') {
                elem_mediaImg.classList.add('u-hidden');
                elem_mediaVideo.classList.add('u-hidden');
                elem_mediaVideoFile.classList.remove('u-hidden');
            } else {
                elem_mediaVideo.classList.add('u-hidden');
                elem_mediaImg.classList.remove('u-hidden');
                elem_mediaVideoFile.classList.add('u-hidden');
            }
            // 當切換章節時圖片自動恢復預設
            // clear media src if chapter scroll
            elem_mediaImg.src = "../images/info_loading.PNG";
            elem_mediaVideo.src = "../images/info_loading.PNG";


            //# 設定資料點開時會顯示的資訊
            // update the project title h2
            document.getElementById("projectTitle").innerHTML = chapter.title;
            document.getElementById("infotext-coordinate").innerHTML = "資料座標 ▸ ";
            document.getElementById("infotext-date").innerHTML = "拍攝日期 ▸ ";
            document.getElementById("infotext-datatitle").innerHTML = "資料標題 ▸ ";
            closedSidebar('infoContent', chapter.location.zoom)


            // 章節之間的跳轉動畫設定
            chapter.location.zoom += 0.3;
            map[chapter.mapAnimation || 'flyTo'](chapter.location);
            chapter.location.zoom -= 0.3;



            // 小地圖設定(範本原始碼，無須改動)
            if (config.inset) {
                if (chapter.location.zoom < 5) {
                    insetMap.flyTo({ center: chapter.location.center, zoom: 0 });
                } else {
                    insetMap.flyTo({ center: chapter.location.center, zoom: 4 });
                }
            }
            if (config.showMarkers) {
                marker.setLngLat(chapter.location.center);
            }
            if (chapter.onChapterEnter.length > 0) {
                chapter.onChapterEnter.forEach(setLayerOpacity);
            }
            if (chapter.callback) {
                window[chapter.callback]();
            }
            if (chapter.rotateAnimation) {
                map.once('moveend', () => {
                    const rotateNumber = map.getBearing();

                    map.rotateTo(rotateNumber + 180, {
                        duration: 100000,
                        easing: function(t) {
                            return t;
                        }
                    });
                });
            }

        })
        .onStepExit(response => {
            var chapter = config.chapters.find(chap => chap.id === response.element.id);
            response.element.classList.remove('active');
            if (chapter.onChapterExit.length > 0) {
                chapter.onChapterExit.forEach(setLayerOpacity);
            }
        });


    // ===========================================================
    // /* Threebox 地圖初始化(後續可新增立體路徑、立體物件等等)，無須修改 */
    // ---- add three.js layer ---- //
    map.addLayer({
        id: 'custom_layer',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function(map, mbxContext) {
            window.tb = new Threebox(
                map,
                mbxContext, {
                    defaultLights: true,
                    enableSelectingFeatures: true,
                    enableSelectingObjects: true,
                    enableDraggingObjects: true,
                    enableRotatingObjects: true,
                    enableTooltips: true
                }
            );

        },
        render: function(gl, matrix) {
            tb.update();
        }
    });
    // ===========================================================


    // ==============================================================================
    // /* 交大校園照片：點座標、圖片連結 */

    // ---- add nycu photo location ---- // 
    map.loadImage( // 讀取圖釘(marker)圖片
        '../images/pin_image_v5.png', //# 填入圖片檔案位置 

        (error, image) => { // 如果圖片成功讀取
            if (error) throw error;
            map.addImage('custom-marker_nycuphoto', image); //# 填寫此圖片的代號(此案例中代號命名為 custom-marker_nycuphoto)

            // 讀取校園座標資料集
            map.addSource('image_points_nycuphoto', { //# 填寫此資料集的代號(此案例中代號命名為 image_points_nycuphoto)
                'type': 'geojson', // 資料讀取格式
                'data': 'Dataset_nycu_photo/2023_0321_183347_photo_location.txt' //# 檔案位置，可替換成其他 api 連結或線上檔案位址連結 
            });

            // 新增資料集圖層 Add a symbol layer
            map.addLayer({
                'id': 'image_points_nycuphoto', //# 填寫此圖層的代號(此案例中代號命名為 image_points_nycuphoto)
                'type': 'symbol', // 此類型的圖層為 'symbol' 代表會用 marker 圖片呈現點資料
                'source': 'image_points_nycuphoto', //# 此圖層的來源資料集代號(此案例中為 image_points_nycuphoto)

                // 圖層樣式設定
                'layout': {
                    'icon-image': 'custom-marker_nycuphoto', //# 填寫此圖層使用的 marker 圖片代號(此案例中為 custom-marker_nycuphoto)
                    'icon-size': 0.4, // marker 大小
                    "icon-allow-overlap": true, // 允許 marker 之間重疊 // false: marker 重疊時會自動 clustering，集中顯示一個

                    // get the title name from the source's "title" property
                    'text-field': ['get', 'title'], //# marker 下方顯示的文字(此案例中顯示的是'title'，例如：竹湖)

                    'text-font': [ // 字體設定
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-allow-overlap': true, // 允許文字之間重疊 // false: 文字重疊時會自動 clustering，集中顯示一個
                    'text-offset': [0, 2.25], // 文字間距
                    'text-anchor': 'top', // 文字定位點
                    "text-size": ["step", ["zoom"], 0, 9, 12] // 文字大小，依據地圖縮放設定
                },
                'paint': { // 文字樣式設定
                    'text-color': '#8e6428', //# 文字色彩
                    'text-halo-color': '#ffffff', //# 文字外框線色彩
                    "text-halo-width": 1 // 文字外框線粗細
                }
            });
        }

    );

    // 當資料集中有任一筆資料被點擊(click)時，觸發事件
    map.on('click', 'image_points_nycuphoto', (e) => { //# 填入圖層代號(此案例中為 image_points_nycuphoto)
        map.flyTo({
            center: e.features[0].geometry.coordinates,
            essential: true,
            padding: {
                top: 0,
                bottom: 0,
                left: 300,
                right: 0
            },
            duration: 1200
        });

        //# 抽換資料卡中的影像連結，以下須根據資料集的內容修改
        changeImageSource(e.features[0].properties.imgurl); // 圖片連結
        changeInfoCoordinate(e.features[0].geometry.coordinates.map(x => x.toFixed(2)).join(', ')); // 資料座標
        changeInfoDate(e.features[0].properties.time); // 拍攝時間
        changeInfoDataTitle(e.features[0].properties.title); //資料標題

        //# 每當有任一筆資料被點擊時，資料卡跳出，並設定地圖的縮放尺寸(目前仍需手動修改)
        openSidebar('infoContent', 15.5)
    });

    // 當滑鼠懸停(hover)資料集中任一筆資料時，觸發事件
    map.on('mouseenter', 'image_points_nycuphoto', () => { //# 填入圖層代號(此案例中為 image_points_nycuphoto)
        map.getCanvas().style.cursor = 'pointer'; // 將游標設定為 pointer
    });

    // 當滑鼠離開時，觸發事件
    map.on('mouseleave', 'image_points_nycuphoto', () => { //# 填入圖層代號(此案例中為 image_points_nycuphoto)
        map.getCanvas().style.cursor = ''; // 恢復預設游標
    });



    // ==============================================================================
    // /* Drone空拍分析影像_白海豚：點座標、影片檔案 */
    // ---- Add Video Symbol Layer ----- 
    map.loadImage(
        '../images/pin_dolphin_v5.png', // 讀取圖釘(marker)圖片

        (error, image) => { // 如果圖片成功讀取
            if (error) throw error;

            map.addImage('custom-marker_dolphin', image); //# 填寫此圖片的代號(此案例中代號命名為 custom-marker_dolphin)

            // 讀取白
            map.addSource('video_points_dolphin', { //# 填寫此資料集的代號(此案例中代號命名為 video_points_dolphin)
                'type': 'geojson', // 資料讀取格式
                'data': { //# 直接寫入地理圖資內容，也可替換成其他檔案位置，或其他 api 連結或線上檔案位址連結 
                    'type': 'FeatureCollection',
                    'features': [{
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [120.497185, 24.301337]
                            },
                            'properties': {
                                'title': '白海豚空拍影像 1',
                                'videourl': 'Dataset_Dolphin/video/dp/dp-1.mp4',
                                'time': ""
                            }
                        },
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [120.502185, 24.312337]
                            },
                            'properties': {
                                'title': '白海豚空拍影像 2',
                                'videourl': 'Dataset_Dolphin/video/dp/dp-2.mp4',
                                'time': ""
                            }
                        }
                    ]
                }
            });

            // 新增資料集圖層 Add a symbol layer
            map.addLayer({
                'id': 'video_points_dolphin', //# 填寫此圖層的代號(此案例中代號命名為 video_points_dolphin)
                'type': 'symbol', // 此類型的圖層為 'symbol' 代表會用 marker 圖片呈現點資料
                'source': 'video_points_dolphin', //# 此圖層的來源資料集代號(此案例中為 video_points_dolphin)

                // 圖層樣式設定
                'layout': {
                    'icon-image': 'custom-marker_dolphin', //# 填寫此圖層使用的 marker 圖片代號(此案例中為 custom-marker_dolphin)
                    'icon-size': 0.4, // marker 大小
                    "icon-allow-overlap": true, // 允許 marker 之間重疊 // false: marker 重疊時會自動 clustering，集中顯示一個

                    // get the title name from the source's "title" property
                    'text-field': ['get', 'title'], //# marker 下方顯示的文字(此案例中顯示的是'title'，例如：白海豚空拍影像 2)

                    'text-font': [ // 字體設定
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-offset': [0, 2.25], // 文字間距
                    'text-anchor': 'top', // 文字定位點
                    "text-size": ["step", ["zoom"], 0, 9, 12] // 文字大小，依據地圖縮放設定
                },
                'paint': { // 文字樣式設定
                    'text-color': '#3d8589', //# 文字色彩
                    'text-halo-color': '#ffffff', //# 文字外框線色彩
                    "text-halo-width": 1 // 文字外框線粗細
                }
            });
        }

    );

    // 當資料集中有任一筆資料被點擊(click)時，觸發事件
    map.on('click', 'video_points_dolphin', (e) => { //# 填入圖層代號(此案例中為 video_points_dolphin)
        map.flyTo({
            center: e.features[0].geometry.coordinates,
            essential: true,
            padding: {
                top: 0,
                bottom: 0,
                left: 300,
                right: 0
            },
            duration: 1200
        });

        //# 抽換資料卡中的影像連結，以下須根據資料集的內容修改
        changeVideoFileSource(e.features[0].properties.videourl); // 影片連結
        changeInfoCoordinate(e.features[0].geometry.coordinates.map(x => x.toFixed(2)).join(', ')); // 資料座標
        changeInfoDate(e.features[0].properties.time); // 拍攝時間
        changeInfoDataTitle(e.features[0].properties.title); //資料標題

        //# 每當有任一筆資料被點擊時，資料卡跳出，並設定地圖的縮放尺寸(目前仍需手動修改)
        openSidebar('infoContent', 12)

    });

    // 當滑鼠懸停(hover)資料集中任一筆資料時，觸發事件
    map.on('mouseenter', 'video_points_dolphin', (e) => { //# 填入圖層代號(此案例中為 video_points_dolphin)
        map.getCanvas().style.cursor = 'pointer'; // 將游標設定為 pointer
    });

    // 當滑鼠離開時，觸發事件 
    map.on('mouseleave', 'video_points_dolphin', () => { //# 填入圖層代號(此案例中為 video_points_dolphin)
        map.getCanvas().style.cursor = ''; // 恢復預設游標
    });


    // ==============================================================================
    // /* 苗栗無人機巡檢：線資料、點資料、影片連結 */

    // ---- Add Drone Path Layer ---- //
    //# 讀取資料集：無人機飛行路徑(geojson格式)
    var miaoli_lineGeometry_0 = "Dataset_Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1130_drone_path_0.txt"
    var miaoli_lineGeometry_1 = "Dataset_Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1154_drone_path_0.txt"
    var miaoli_lineGeometry_2 = "Dataset_Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1154_drone_path_1.txt"
    var miaoli_lineGeometry_3 = "Dataset_Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1441_drone_path_0.txt"
    var miaoli_lineGeometry_4 = "Dataset_Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1505_drone_path_0.txt"

    // 自定義函式，用於繪製貼在地上的線資料，使用 Mapbox 
    createLineLayer(map, miaoli_lineGeometry_0, "miaoli_lineGeometry_0", "#ffffff") //#  createLineLayer(map, 線資料集, "圖層代號", 線條顏色)
    createLineLayer(map, miaoli_lineGeometry_1, "miaoli_lineGeometry_1", "#888888")
    createLineLayer(map, miaoli_lineGeometry_2, "miaoli_lineGeometry_2", "#333333")
    createLineLayer(map, miaoli_lineGeometry_3, "miaoli_lineGeometry_3", "#666666")
    createLineLayer(map, miaoli_lineGeometry_4, "miaoli_lineGeometry_4", "#000000")



    // Add Miaoli_dronePath Video Symbol Layer 
    map.loadImage(
        '../images/pin_drone_v5.png', // 讀取圖釘(marker)圖片

        (error, image) => { // 如果圖片成功讀取
            if (error) throw error;
            map.addImage('custom-marker_miaoli', image); //# 填寫此圖片的代號(此案例中代號命名為 custom-marker_miaoli)

            // 讀取無人機路線起點座標資料集
            map.addSource('video_points_miaoli', { //# 填寫此資料集的代號(此案例中代號命名為 video_points_miaoli)
                'type': 'geojson', // 資料讀取格式
                'data': { //# 直接寫入地理圖資內容，也可替換成其他檔案位置，或其他 api 連結或線上檔案位址連結 
                    'type': 'FeatureCollection',
                    'features': [{
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [120.879545, 24.538407]
                            },
                            'properties': {
                                'title': '路徑1',
                                'time': '2023_0316_1130',
                                'videourl': 'https://www.youtube.com/embed/E2DbnCGL63g?autoplay=1&mute=1&modestbranding=1&loop=1'
                            }
                        },
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [120.8863807, 24.53765926]
                            },
                            'properties': {
                                'title': '路徑2',
                                'time': '2023_0316_1154',
                                'videourl': 'https://www.youtube.com/embed/P810d4VNdzw?autoplay=1&mute=1&modestbranding=1&loop=1'
                            }
                        },
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [120.8800277, 24.53879649]
                            },
                            'properties': {
                                'title': '路徑3',
                                'time': '2023_0316_1441',
                                'videourl': 'https://www.youtube.com/embed/stc-bRSqmUM?autoplay=1&mute=1&modestbranding=1&loop=1'
                            }
                        },
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [120.886057, 24.53799016]
                            },
                            'properties': {
                                'title': '路徑4',
                                'time': '2023_0316_1505',
                                'videourl': 'https://www.youtube.com/embed/IFKbZxpYIiA?autoplay=1&mute=1&modestbranding=1&loop=1'
                            }
                        }
                    ]
                }
            });

            // 新增資料集圖層 Add a symbol layer
            map.addLayer({
                'id': 'video_points_miaoli', //# 填寫此圖層的代號(此案例中代號命名為 video_points_miaoli)
                'type': 'symbol', // 此類型的圖層為 'symbol' 代表會用 marker 圖片呈現點資料
                'source': 'video_points_miaoli', //# 此圖層的來源資料集代號(此案例中為 video_points_miaoli)

                // 圖層樣式設定
                'layout': {
                    'icon-image': 'custom-marker_miaoli', //# 填寫此圖層使用的 marker 圖片代號(此案例中為 custom-marker_miaoli)
                    'icon-size': 0.4, // marker 大小
                    "icon-allow-overlap": true, // 允許 marker 之間重疊 // false: marker 重疊時會自動 clustering，集中顯示一個

                    // get the title name from the source's "title" property
                    'text-field': ['get', 'title'], //# marker 下方顯示的文字(此案例中顯示的是'title'，例如：路徑4)

                    'text-font': [ // 字體設定
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],

                    'text-allow-overlap': true, // 允許文字之間重疊 // false: 文字重疊時會自動 clustering，集中顯示一個
                    'text-offset': [0, 2.25], // 文字間距
                    'text-anchor': 'top', // 文字定位點
                    "text-size": ["step", ["zoom"], 0, 9, 12] // 文字大小，依據地圖縮放設定
                },
                'paint': { // 文字樣式設定
                    'text-color': '#728c2c', //# 文字色彩
                    'text-halo-color': '#ffffff', //# 文字外框線色彩
                    "text-halo-width": 1 // 文字外框線粗細
                }
            });
        }

    );


    // 當資料集中有任一筆資料被點擊(click)時，觸發事件
    map.on('click', 'video_points_miaoli', (e) => { //# 填入圖層代號(此案例中為 video_points_miaoli)
        map.flyTo({
            center: [120.881246, 24.539507],
            essential: true,
            padding: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            },
            duration: 1200
        });

        //# 抽換資料卡中的影像連結，以下須根據資料集的內容修改
        changeVideoSource(e.features[0].properties.videourl); // 影片連結
        changeInfoCoordinate(e.features[0].geometry.coordinates.map(x => x.toFixed(2)).join(', ')); // 資料座標
        changeInfoDate(e.features[0].properties.time); // 拍攝時間
        changeInfoDataTitle(e.features[0].properties.title) //資料標題

        //# 每當有任一筆資料被點擊時，資料卡跳出，並設定地圖的縮放尺寸(目前仍需手動修改)
        openSidebar('infoContent', 16)
    });

    // 當滑鼠懸停(hover)資料集中任一筆資料時，觸發事件
    map.on('mouseenter', 'video_points_miaoli', () => { //# 填入圖層代號(此案例中為 image_points_nycuphoto)
        map.getCanvas().style.cursor = 'pointer'; // 將游標設定為 pointer
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'video_points_miaoli', () => { //# 填入圖層代號(此案例中為 image_points_nycuphoto)
        map.getCanvas().style.cursor = ''; // 恢復預設游標
    });






    // ==============================================================================
    // /* 群飛無人機立體路徑：線資料 */

    // ---- Add Drone Path Layer ----
    // 若資料來源為國網中心，格式參考如下
    // var ur_lineGeometry = "https://scidm.nchc.org.tw/dataset/c4b05e4e-d520-490c-9ef5-ca88b83dee6d/resource/b595752b-a55c-4a9a-b9e6-074515c7905d/nchcproxy/2023_0321_201932_drone_path_2.txt" 

    // 讀取線資料集
    var ur_lineGeometry_0 = "Dataset_dronePath_demo/2023_0409_170757_drone_path_0.txt"
    var ur_lineGeometry_1 = "Dataset_dronePath_demo/2023_0409_170757_drone_path_1.txt"
    var ur_lineGeometry_2 = "Dataset_dronePath_demo/2023_0409_170757_drone_path_2.txt"

    // 自定義函式，用於繪製有包含高度的立體線資料，使用 Threebox 
    createThreejsLine(ur_lineGeometry_0, tb, "#ffffff"); //#  createThreejsLine(線資料集, tb, 線條顏色)
    createThreejsLine(ur_lineGeometry_1, tb, "#ffffff");
    createThreejsLine(ur_lineGeometry_2, tb, "#ffffff");



    // ==============================================================================
    // /* 多良車站串流影像：點資料、影片連結 */

    // ---- Add Video Symbol Layer ----
    map.loadImage(
        '../images/pin_VideoCamera_v5.png', // 讀取圖釘(marker)圖片

        (error, image) => { // 如果圖片成功讀取
            if (error) throw error;
            map.addImage('stream-custom-marker', image); //# 填寫此圖片的代號(此案例中代號命名為 stream-custom-marker)

            // 讀取串流影像資料集
            map.addSource('video_points', { //# 填寫此資料集的代號(此案例中代號命名為 video_points)
                'type': 'geojson', // 資料讀取格式
                'data': { //# 直接寫入地理圖資內容，也可替換成其他檔案位置，或其他 api 連結或線上檔案位址連結 
                    'type': 'FeatureCollection',
                    'features': [{
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [120.95911, 22.50725]
                            },
                            'properties': {
                                'title': '台東 多良車站',
                                'time': 'live streaming',
                                'videourl': 'https://www.youtube.com/embed/UCG1aXVO8H8?autoplay=1&mute=1&modestbranding=1&loop=1&vq=hd1080'
                            }
                        }

                    ]
                }
            });

            // 新增資料集圖層 Add a symbol layer
            map.addLayer({
                'id': 'video_points', //# 填寫此圖層的代號(此案例中代號命名為 video_points)
                'type': 'symbol', // 此類型的圖層為 'symbol' 代表會用 marker 圖片呈現點資料
                'source': 'video_points', //# 此圖層的來源資料集代號(此案例中為 video_points)

                // 圖層樣式設定
                'layout': {
                    'icon-image': 'stream-custom-marker', //# 填寫此圖層使用的 marker 圖片代號(此案例中為 stream-custom-marker)
                    'icon-size': 0.4, // marker 大小

                    // get the title name from the source's "title" property
                    'text-field': ['get', 'title'], //# marker 下方顯示的文字(此案例中顯示的是'title'，例如：台東 多良車站)

                    'text-font': [ // 字體設定
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-offset': [0, 2.25], // 文字間距
                    'text-anchor': 'top', // 文字定位點
                    "text-size": ["step", ["zoom"], 0, 9, 12] // 文字大小，依據地圖縮放設定
                },
                'paint': { // 文字樣式設定
                    'text-color': '#3f467a', //# 文字色彩
                    'text-halo-color': '#ffffff', //# 文字外框線色彩
                    "text-halo-width": 1 // 文字外框線粗細
                }
            });
        }

    );

    // 當資料集中有任一筆資料被點擊(click)時，觸發事件
    map.on('click', 'video_points', (e) => { //# 填入圖層代號(此案例中為 video_points)
        map.flyTo({
            center: e.features[0].geometry.coordinates,
            essential: true,
            padding: {
                top: 0,
                bottom: 0,
                left: 300,
                right: 0
            },
            duration: 1200
        });

        //# 抽換資料卡中的影像連結，以下須根據資料集的內容修改
        changeVideoSource(e.features[0].properties.videourl); // 串流連結
        changeInfoCoordinate(e.features[0].geometry.coordinates.map(x => x.toFixed(2)).join(', ')); // 資料座標
        changeInfoDate(e.features[0].properties.time); // 拍攝時間
        changeInfoDataTitle(e.features[0].properties.title) // 資料標題

        //# 每當有任一筆資料被點擊時，資料卡跳出，並設定地圖的縮放尺寸(目前仍需手動修改)
        openSidebar('infoContent', 14)
    });

    // 當滑鼠懸停(hover)資料集中任一筆資料時，觸發事件
    map.on('mouseenter', 'video_points', () => { //# 填入圖層代號(此案例中為 video_points)
        map.getCanvas().style.cursor = 'pointer'; // 將游標設定為 pointer
    });

    // 當滑鼠離開時，觸發事件
    map.on('mouseleave', 'video_points', () => { //# 填入圖層代號(此案例中為 video_points)
        map.getCanvas().style.cursor = ''; // 恢復預設游標
    });


    // ==============================================================================
    // /* Display 3d building */

    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
    ).id;

    // The 'building' layer in the Mapbox Streets
    // vector tileset contains building height data
    // from OpenStreetMap.
    map.addLayer({
            'id': 'add-3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#ffffff',

                // Use an 'interpolate' expression to
                // add a smooth transition effect to
                // the buildings as the user zooms in.
                'fill-extrusion-height': [
                    'interpolate', ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05, ['get', 'height']
                ],
                'fill-extrusion-base': [
                    'interpolate', ['linear'],
                    ['zoom'],
                    15,
                    0,
                    15.05, ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
            }
        },
        labelLayerId
    );


});



// ===========================================================
// /* 其他函式與自定義函式，無須修改 */
// ===========================================================

// ---------------------------------------
// Helper functions for insetmap
function getInsetBounds() {
    let bounds = map.getBounds();

    let boundsJson = {
        "type": "FeatureCollection",
        "features": [{
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            bounds._sw.lng,
                            bounds._sw.lat
                        ],
                        [
                            bounds._ne.lng,
                            bounds._sw.lat
                        ],
                        [
                            bounds._ne.lng,
                            bounds._ne.lat
                        ],
                        [
                            bounds._sw.lng,
                            bounds._ne.lat
                        ],
                        [
                            bounds._sw.lng,
                            bounds._sw.lat
                        ]
                    ]
                ]
            }
        }]
    }

    if (initLoad) {
        addInsetLayer(boundsJson);
        initLoad = false;
    } else {
        updateInsetLayer(boundsJson);
    }

}

// -----------------------------------------
// add inset map layer
function addInsetLayer(bounds) {
    insetMap.addSource('boundsSource', {
        'type': 'geojson',
        'data': bounds
    });

    insetMap.addLayer({
        'id': 'boundsLayer',
        'type': 'fill',
        'source': 'boundsSource', // reference the data source
        'layout': {},
        'paint': {
            'fill-color': '#fff', // blue color fill
            'fill-opacity': 0.2
        }
    });
    // // Add a black outline around the polygon.
    insetMap.addLayer({
        'id': 'outlineLayer',
        'type': 'line',
        'source': 'boundsSource',
        'layout': {},
        'paint': {
            'line-color': '#000',
            'line-width': 1
        }
    });
}

// update inset map layer
function updateInsetLayer(bounds) {
    insetMap.getSource('boundsSource').setData(bounds);
}


// -----------------------------------------
// setup resize event
window.addEventListener('resize', scroller.resize);


// -----------------------------------------
// change info img
function changeImageSource(imgsrc) {
    document.getElementById("Imgcontent").src = imgsrc;
}

// change info video
function changeVideoSource(videosrc) {
    document.getElementById("Videocontent").src = videosrc;
}

// change info video
function changeVideoFileSource(videosrc) {
    document.getElementById("VideoFilecontent_Source").src = videosrc;

    var x = document.getElementById("VideoFilecontent");
    x.autoplay = true;
    x.load();

}

// -------------------------------------------
// change coordinate
function changeInfoCoordinate(coorsrc) {
    document.getElementById("infotext-coordinate").innerHTML = "資料座標 ▸ " + coorsrc;
}

// change time
function changeInfoDate(timescr) {
    document.getElementById("infotext-date").innerHTML = "拍攝日期 ▸ " + timescr;
}

// change time
function changeInfoDataTitle(timescr) {
    document.getElementById("infotext-datatitle").innerHTML = "資料標題 ▸ " + timescr;
}



// -----------------------------------------
//convenience function for fetch
function fetchFunction(url, cb) {
    fetch(url)
        .then(
            function(response) {
                if (response.status === 200) {
                    response.json()
                        .then(function(data) {
                            cb(data)
                        })
                }
            }
        )
}


// -----------------------------------------
// create line geometry from fetch function
function createThreejsLine(ur_lineGeometry, tb, clr) {
    fetchFunction(ur_lineGeometry, function(data) {
        var lineInstance = tb.line({
            geometry: data.features[0].geometry.coordinates,
            width: 2,
            color: clr
        });
        tb.add(lineInstance);
    })
}

// -----------------------------------------
// add line source and layer
function createLineLayer(map, line_data, line_name, color) {
    var sourceName = "route_" + line_name;
    map.addSource(sourceName, {
        'type': 'geojson',
        'data': line_data
    });
    map.addLayer({
        'id': sourceName,
        'type': 'line',
        'source': sourceName,
        'layout': {
            'line-join': 'round',
            'line-cap': 'round'
        },
        'paint': {
            'line-color': color,
            'line-width': 3
        }
    });
}


// -----------------------------------------
// toggle left/right sidebar
function closedSidebar(id, scl = 0) {
    const elem = document.getElementById(id);
    // Add or remove the 'collapsed' CSS class from the sidebar element.
    // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
    const collapsed = elem.classList.add('collapsed');
    const padding = {};
    // // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
    // padding['left'] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
    padding['left'] = 0; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
    // // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
    // console.log(map.getZoom() + 1)
    if (scl == 0) { scl = map.getZoom() + 0.3; } else { scl = scl + 0.3; }
    // console.log(scl)
    // console.log(scl)
    map.easeTo({
        padding: padding,
        zoom: map.getZoom() + 0.3,
        // zoom: scl+0.3,
        duration: 1000 // In ms. This matches the CSS transition duration property.
    });

}

function openSidebar(id, scl) {
    const elem = document.getElementById(id);
    // Add or remove the 'collapsed' CSS class from the sidebar element.
    // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
    const collapsed = elem.classList.remove('collapsed');
    const padding = {};
    // // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
    // padding[id] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
    // // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
    // map.easeTo({
    //     padding: padding,
    //     duration: 1000 // In ms. This matches the CSS transition duration property.
    // });
    padding['left'] = 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
    // // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
    // console.log(map.getZoom() + 1)
    map.easeTo({
        padding: padding,
        zoom: scl,
        duration: 1000 // In ms. This matches the CSS transition duration property.
    });
}
