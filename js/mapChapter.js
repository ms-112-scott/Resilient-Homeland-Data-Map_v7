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

var story = document.getElementById('story');
var features = document.createElement('div');
features.setAttribute('id', 'features');

var header = document.createElement('div');

if (config.title) {
    var titleText = document.createElement('h1');
    titleText.innerText = config.title;
    header.appendChild(titleText);
}

if (config.subtitle) {
    var subtitleText = document.createElement('h2');
    subtitleText.innerText = config.subtitle;
    header.appendChild(subtitleText);
}

if (config.byline) {
    var bylineText = document.createElement('p');
    bylineText.innerText = config.byline;
    header.appendChild(bylineText);
}

if (header.innerText.length > 0) {
    header.classList.add(config.theme);
    header.setAttribute('id', 'header');
    story.appendChild(header);
}


// -------------------------------------------------
// create chapters
config.chapters.forEach((record, idx) => {
    var container = document.createElement('div');
    var chapter = document.createElement('div');

    // if (record.title) {
    //     var title = document.createElement('h3');
    //     title.innerText = record.title;
    //     chapter.appendChild(title);
    // }

    // if (record.image) {
    //     var image = new Image();
    //     image.src = record.image;
    //     chapter.appendChild(image);
    // }

    // if (record.description) {
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


// -------------------------------------------
// create footer
var footer = document.createElement('div');

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

// -------------------------------------------
// set mapbox API key
mapboxgl.accessToken = config.accessToken;


// -------------------------------------------
// create map
const transformRequest = (url) => {
    const hasQuery = url.indexOf("?") !== -1;
    const suffix = hasQuery ? "&pluginName=scrollytellingV2" : "?pluginName=scrollytellingV2";
    return {
        url: url + suffix
    }
}

var map = new mapboxgl.Map({
    container: 'map',
    style: config.style,
    center: config.chapters[0].location.center,
    zoom: config.chapters[0].location.zoom,
    bearing: config.chapters[0].location.bearing,
    pitch: config.chapters[0].location.pitch,
    // interactive: false,
    interactive: true,
    transformRequest: transformRequest,
    projection: config.projection,
    // scrollZoom: false
    // https://docs.mapbox.com/mapbox-gl-js/api/map/#map
});

// -------------------------------------------
// Create a inset map if enabled in config.js
if (config.inset) {
    var insetMap = new mapboxgl.Map({
        container: 'mapInset', // container id
        style: 'mapbox://styles/mapbox/outdoors-v10', //hosted style id
        center: config.chapters[0].location.center,
        // Hardcode above center value if you want insetMap to be static.
        zoom: 4, // starting zoom
        hash: false,
        interactive: false,
        attributionControl: false,
        //Future: Once official mapbox-gl-js has globe view enabled,
        //insetmap can be a globe with the following parameter.
        //projection: 'globe'
    });
}

// -------------------------------------------
// Create a marker at chapters' center location if enabled in config.js
if (config.showMarkers) {
    var marker = new mapboxgl.Marker({ color: config.markerColor });
    marker.setLngLat(config.chapters[0].location.center).addTo(map);
}

// instantiate the scrollama
var scroller = scrollama();


// =========================================================================
// load map
map.on("load", function() {


    // set language --------------------------------------------------------
    // let labels = ['country-label', 'state-label',
    //     'settlement-label', 'settlement-subdivision-label',
    //     'airport-label', 'poi-label', 'water-point-label',
    //     'water-line-label', 'natural-point-label',
    //     'natural-line-label', 'waterway-label', 'road-label'
    // ];

    // labels.forEach(label => {
    //     map.setLayoutProperty(label, 'text-field', ['get', 'name_en']); // name_zh-Hant
    // });


    // set 3d terrain ------------------------------------------------------
    if (config.use3dTerrain) {
        map.addSource('mapbox-dem', {
            'type': 'raster-dem',
            'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
            'tileSize': 512,
            'maxzoom': 14
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

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


    // create chapter nav html elem ------------------------------------------------------
    config.chapters.forEach(c => {
        if (c.id != 'first-identifier') {
            // var node = document.createElement("div");
            // node.classList.add("nav-item")
            // var textNode = document.createTextNode(c.title);
            // node.appendChild(textNode);
            // document.getElementById("navbar").appendChild(node);
            var a = document.createElement('a');
            var linkText = document.createTextNode(c.title);
            a.classList.add("nav-item")
            a.appendChild(linkText);
            a.href = "#" + c.id;
            a.onclick = function() {
                console.log(c.location.center)
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
                    duration: 1200
                });

            }
            document.getElementById("navbar").appendChild(a);
        }

    })


    // As the map moves, grab and update bounds in inset map. ---------------
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
            var chapter = config.chapters.find(chap => chap.id === response.element.id);
            response.element.classList.add('active');

            // active chapter nac html elem ------------------------------------------------------
            var obj = document.getElementsByClassName("nav-item");
            for (let item of obj) {
                // console.log(item.innerHTML);
                if (chapter.title == item.innerHTML) item.classList.add("active")
                else { item.classList.remove("active"); }
            }




            // toggle hero card
            const elem_hero = document.getElementById('hero');
            if (chapter.id === "first-identifier") {
                elem_hero.classList.remove('hide');
            } else elem_hero.classList.add('hide');

            // toggle info card
            const elem_info = document.getElementById('info');
            if (chapter.id === "first-identifier") {
                elem_info.classList.add('hide');
            } else elem_info.classList.remove('hide');

            // toggle mapInset
            const elem_inset = document.getElementById('mapInset');
            if (chapter.id === "first-identifier") {
                elem_inset.classList.add('hidden');
            } else elem_inset.classList.remove('hidden');

            // toggle nav
            const elem_nav = document.getElementById('navbar');
            if (chapter.id === "first-identifier") {
                elem_nav.classList.add('hidden');
            } else elem_nav.classList.remove('hidden');

            // toggle media type
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
            // clear media src if chapter scroll
            elem_mediaImg.src = "../images/info_loading.PNG";
            elem_mediaVideo.src = "../images/info_loading.PNG";


            // update the project title h2
            document.getElementById("projectTitle").innerHTML = chapter.title;
            document.getElementById("infotext-coordinate").innerHTML = "資料座標 ▸ ";
            document.getElementById("infotext-date").innerHTML = "拍攝日期 ▸ ";
            document.getElementById("infotext-datatitle").innerHTML = "資料標題 ▸ ";
            closedSidebar('infoContent', chapter.location.zoom)




            chapter.location.zoom += 0.3;
            map[chapter.mapAnimation || 'flyTo'](chapter.location);
            chapter.location.zoom -= 0.3;



            // Incase you do not want to have a dynamic inset map,
            // rather want to keep it a static view but still change the
            // bbox as main map move: comment out the below if section.
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

                    // requestAnimationFrame -----------------------------------
                    // requestAnimationFrame(rotateCamera);
                    // const timestamp_curr = Math.floor(window.performance.now());

                    // function rotateCamera(timestamp) {
                    //     // clamp the rotation between 0 -360 degrees
                    //     // Divide timestamp by 100 to slow rotation to ~10 degrees / sec

                    //     map.rotateTo(rotateNumber + ((timestamp - timestamp_curr) / 300) % 360, { duration: 0 }); // 300 -> rotate speed, larger than slower
                    //     // Request the next frame of the animation.
                    //     requestAnimationFrame(rotateCamera);

                    // }
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



    //  Center the map on a clicked feature ------------------------------------------
    //  add nycu photo location 

    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
    map.loadImage(
        // '../images/pin_dolphin.png',
        // '../images/pin_image_blue.png',
        '../images/pin_image_v5.png',
        // '../images/pin_image_white.png',

        (error, image) => {
            if (error) throw error;
            map.addImage('custom-marker_nycuphoto', image);
            // Add a GeoJSON source with 2 points
            map.addSource('image_points_nycuphoto', {
                'type': 'geojson',
                'data': 'Dataset_nycu_photo/2023_0321_183347_photo_location.txt' // x640
            });

            // Add a symbol layer
            map.addLayer({
                'id': 'image_points_nycuphoto',
                'type': 'symbol',

                'source': 'image_points_nycuphoto',
                'layout': {
                    'icon-image': 'custom-marker_nycuphoto',
                    'icon-size': 0.4,
                    "icon-allow-overlap": true,
                    // get the title name from the source's "title" property
                    'text-field': ['get', 'title'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-allow-overlap': true,
                    'text-offset': [0, 2.25],
                    'text-anchor': 'top',
                    // 'text-size': 12,
                    "text-size": ["step", ["zoom"], 0, 9, 12]
                },
                'paint': {
                    'text-color': '#8e6428',
                    'text-halo-color': '#ffffff',
                    "text-halo-width": 1
                }
            });
        }

    );

    //  Center the map image_points a clicked feature
    map.on('click', 'image_points_nycuphoto', (e) => {
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


        changeImageSource(e.features[0].properties.imgurl);
        changeInfoCoordinate(e.features[0].geometry.coordinates.map(x => x.toFixed(2)).join(', '));
        changeInfoDate(e.features[0].properties.time);
        changeInfoDataTitle(e.features[0].properties.title);
        openSidebar('infoContent', 15.5)
    });

    map.on('mouseenter', 'image_points_nycuphoto', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'image_points_nycuphoto', () => {
        map.getCanvas().style.cursor = '';
    });




    // Add Video Symbol Layer -------------------------------------------------------
    // Drone空拍分析影像_白海豚
    map.loadImage(
        // '../images/pin_dolphin.png',
        // '../images/pin_dolphin_blue.png',
        '../images/pin_dolphin_v5.png',

        // 'test.svg',
        (error, image) => {
            if (error) throw error;
            map.addImage('custom-marker_dolphin', image);
            // Add a GeoJSON source with 2 points
            map.addSource('video_points_dolphin', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [{
                            // feature for Mapbox DC
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
                            // feature for Mapbox SF
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

            // Add a symbol layer
            map.addLayer({
                'id': 'video_points_dolphin',
                'type': 'symbol',
                'source': 'video_points_dolphin',
                'layout': {
                    'icon-image': 'custom-marker_dolphin',
                    'icon-size': 0.4,
                    "icon-allow-overlap": true,
                    // get the title name from the source's "title" property
                    'text-field': ['get', 'title'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-offset': [0, 2.25],
                    'text-anchor': 'top',
                    "text-size": ["step", ["zoom"], 0, 9, 12]
                },
                'paint': {
                    'text-color': '#3d8589',
                    'text-halo-color': '#ffffff',
                    "text-halo-width": 1
                }
            });
        }

    );

    // let hoverID = null;
    //  Center the map video_points a clicked feature
    map.on('click', 'video_points_dolphin', (e) => {
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


        changeVideoFileSource(e.features[0].properties.videourl);
        changeInfoCoordinate(e.features[0].geometry.coordinates.map(x => x.toFixed(2)).join(', '));
        changeInfoDate(e.features[0].properties.time);
        changeInfoDataTitle(e.features[0].properties.title);
        openSidebar('infoContent', 12)

    });

    map.on('mouseenter', 'video_points_dolphin', (e) => {
        map.getCanvas().style.cursor = 'pointer';
        // console.log(e.features[0].layer.layout.icon - size);
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'video_points_dolphin', () => {
        map.getCanvas().style.cursor = '';
    });


    //  Add Drone Path Layer ---------------------------------------------------------
    // Miaoli_dronePath
    var miaoli_lineGeometry_0 = "Dataset_Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1130_drone_path_0.txt"
    var miaoli_lineGeometry_1 = "Dataset_Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1154_drone_path_0.txt"
    var miaoli_lineGeometry_2 = "Dataset_Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1154_drone_path_1.txt"
    var miaoli_lineGeometry_3 = "Dataset_Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1441_drone_path_0.txt"
    var miaoli_lineGeometry_4 = "Dataset_Miaoli_drone/2023_0531_Miaoli_dronePath/2023_0316_1505_drone_path_0.txt"
    createLineLayer(map, miaoli_lineGeometry_0, "miaoli_lineGeometry_0", "#ffffff")
    createLineLayer(map, miaoli_lineGeometry_1, "miaoli_lineGeometry_1", "#888888")
    createLineLayer(map, miaoli_lineGeometry_2, "miaoli_lineGeometry_2", "#333333")
    createLineLayer(map, miaoli_lineGeometry_3, "miaoli_lineGeometry_3", "#666666")
    createLineLayer(map, miaoli_lineGeometry_4, "miaoli_lineGeometry_4", "#000000")




    // Add Miaoli_dronePath Video Symbol Layer -------------------------------------------------------
    map.loadImage(
        // '../images/pin_drone_blue.png',
        '../images/pin_drone_v5.png',
        // '../images/pin_drone_light.png',

        (error, image) => {
            if (error) throw error;
            map.addImage('custom-marker_miaoli', image);
            // Add a GeoJSON source with 2 points
            map.addSource('video_points_miaoli', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [{
                            // feature for Mapbox DC
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
                            // feature for Mapbox SF
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
                            // feature for Mapbox SF
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                // 'coordinates': [120.8795277, 24.53839649]
                                'coordinates': [120.8800277, 24.53879649]
                            },
                            'properties': {
                                'title': '路徑3',
                                'time': '2023_0316_1441',
                                'videourl': 'https://www.youtube.com/embed/stc-bRSqmUM?autoplay=1&mute=1&modestbranding=1&loop=1'
                            }
                        },
                        {
                            // feature for Mapbox SF
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                // 'coordinates': [120.886357, 24.53772016]
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

            // Add a symbol layer
            map.addLayer({
                'id': 'video_points_miaoli',
                'type': 'symbol',
                'source': 'video_points_miaoli',
                'layout': {
                    'icon-image': 'custom-marker_miaoli',
                    'icon-size': 0.4,
                    "icon-allow-overlap": true,
                    // get the title name from the source's "title" property
                    'text-field': ['get', 'title'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-allow-overlap': true,
                    'text-offset': [0, 2.25],
                    'text-anchor': 'top',
                    "text-size": ["step", ["zoom"], 0, 9, 12]
                },
                'paint': {
                    'text-color': '#728c2c',
                    'text-halo-color': '#ffffff',
                    "text-halo-width": 1
                }
            });
        }

    );




    //  Center the map video_points a clicked feature
    map.on('click', 'video_points_miaoli', (e) => {
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


        changeVideoSource(e.features[0].properties.videourl);
        changeInfoCoordinate(e.features[0].geometry.coordinates.map(x => x.toFixed(2)).join(', '));
        changeInfoDate(e.features[0].properties.time);
        changeInfoDataTitle(e.features[0].properties.title)
        openSidebar('infoContent', 16)



    });

    map.on('mouseenter', 'video_points_miaoli', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'video_points_miaoli', () => {
        map.getCanvas().style.cursor = '';
    });



    // Add Drone Path Layer on the Sea ---------------------------------------------------------
    // Drone Path with Photo Location
    // var ur_lineGeometry_ch1 = "https://scidm.nchc.org.tw/dataset/c4b05e4e-d520-490c-9ef5-ca88b83dee6d/resource/e5e91390-223c-430b-9893-f7af85f3c08e/nchcproxy/2023_0412_112708_drone_path_0.txt";
    // var temp = "https://scidm.nchc.org.tw/dataset/c4b05e4e-d520-490c-9ef5-ca88b83dee6d/resource/b1a8725f-1092-48aa-bf27-23876fc4d0d6/nchcproxy/2023_0412_110450_drone_path_0.txt";
    //     // Three.js line geometry test ---------------------------------------------------
    //     //*--- add three.js layer
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




    //  Add Drone Path Layer ---------------------------------------------------------
    // 2023_0321_201932_drone_path_2.txt
    var ur_lineGeometry = "https://scidm.nchc.org.tw/dataset/c4b05e4e-d520-490c-9ef5-ca88b83dee6d/resource/b595752b-a55c-4a9a-b9e6-074515c7905d/nchcproxy/2023_0321_201932_drone_path_2.txt"

    var ur_lineGeometry_0 = "Dataset_dronePath_demo/2023_0409_170757_drone_path_0.txt"
    var ur_lineGeometry_1 = "Dataset_dronePath_demo/2023_0409_170757_drone_path_1.txt"
    var ur_lineGeometry_2 = "Dataset_dronePath_demo/2023_0409_170757_drone_path_2.txt"

    // Three.js line geometry test ---------------------------------------------------
    //*--- add three.js layer
    //    map.addLayer({
    //     id: 'custom_layer',
    //     type: 'custom',
    //     renderingMode: '3d',
    //     onAdd: function(map, mbxContext) {
    //         window.tb = new Threebox(
    //             map,
    //             mbxContext, {
    //                 defaultLights: true,
    //                 enableSelectingFeatures: true,
    //                 enableSelectingObjects: true,
    //                 enableDraggingObjects: true,
    //                 enableRotatingObjects: true,
    //                 enableTooltips: true
    //             }
    //         );

    //     },
    //     render: function(gl, matrix) {
    //         tb.update();
    //     }
    // });
    //*---

    createThreejsLine(ur_lineGeometry_0, tb);
    createThreejsLine(ur_lineGeometry_1, tb);
    createThreejsLine(ur_lineGeometry_2, tb);




    // Add Video Symbol Layer -------------------------------------------------------
    map.loadImage(
        // '../images/pin_VideoCamera_blue.png',
        '../images/pin_VideoCamera_v5.png',
        (error, image) => {
            if (error) throw error;
            map.addImage('custom-marker', image);
            // Add a GeoJSON source with 2 points
            map.addSource('video_points', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': [{
                            // feature for Mapbox DC
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

            // Add a symbol layer
            map.addLayer({
                'id': 'video_points',
                'type': 'symbol',
                'source': 'video_points',
                'layout': {
                    'icon-image': 'custom-marker',
                    'icon-size': 0.4,
                    // get the title name from the source's "title" property
                    'text-field': ['get', 'title'],
                    'text-font': [
                        'Open Sans Semibold',
                        'Arial Unicode MS Bold'
                    ],
                    'text-offset': [0, 2.25],
                    'text-anchor': 'top',
                    "text-size": ["step", ["zoom"], 0, 9, 12]
                },
                'paint': {
                    'text-color': '#3f467a',
                    'text-halo-color': '#ffffff',
                    "text-halo-width": 1
                }
            });
        }

    );

    //  Center the map video_points a clicked feature
    map.on('click', 'video_points', (e) => {
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


        changeVideoSource(e.features[0].properties.videourl);
        changeInfoCoordinate(e.features[0].geometry.coordinates.map(x => x.toFixed(2)).join(', '));
        changeInfoDate(e.features[0].properties.time);
        changeInfoDataTitle(e.features[0].properties.title)
        openSidebar('infoContent', 14)


    });

    map.on('mouseenter', 'video_points', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'video_points', () => {
        map.getCanvas().style.cursor = '';
    });


});




// =========================================================
// other function methods

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
// add indet map layer
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

// update indet map layer
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
function createThreejsLine(ur_lineGeometry, tb) {
    fetchFunction(ur_lineGeometry, function(data) {
        // console.log(data.features[0].geometry.coordinates);
        var lineInstance = tb.line({
            geometry: data.features[0].geometry.coordinates,
            width: 2,
            // color: '#1e9696'
            color: '#ffffff'
        });
        // console.log(data.features[0].geometry.coordinates)
        // var tubeInstance = tb.tube({
        //     geometry: data.features[0].geometry.coordinates,
        //     radius: 20,
        //     color: '#1e9696'
        // })

        tb.add(lineInstance);
        // tb.add(tubeInstance);

    })
}


// -----------------------------------------
// add line source and layer
function createLineLayer(map, line_data, line_name, color) {
    var sourceName = "route_" + line_name;
    // console.log(sourceName);
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
    // map.flyTo({
    //     // center: e.features[0].geometry.coordinates,
    //     essential: true,
    //     padding: {
    //         top: 0,
    //         bottom: 0,
    //         left: -300,
    //         right: 0
    //     },
    //     duration: 1200
    // });
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


// -----------------------------------------
// change the url of image
// function changeImageSource(imgsrc) {
//     document.getElementById("Imgcontent").src = imgsrc;
// }


// -----------------------------------------
// map padding animation
// function mapPaddingTrue() {
//     map.easeTo({
//         padding: 300,
//         duration: 1000
//     });

//     console.log("true")
// }