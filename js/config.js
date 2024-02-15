var config = {
    // style: 'mapbox://styles/mapbox/dark-v10', // dark style
    // style: 'mapbox://styles/mapbox/streets-v11',
    // style: 'mapbox://styles/mapbox/light-v10',
    // style: 'mapbox://styles/mapbox/satellite-v9',
    style: 'mapbox://styles/mapbox/outdoors-v10',
    accessToken: 'pk.eyJ1IjoieXVuY2hlbi1sZWUiLCJhIjoiY2wxeGttYmg0MDNwaTNicWY5bWM5ZHM0OCJ9.gS5S-DMTk308nQP8MAzN0w', // my token
    // showMarkers: true,
    showMarkers: false,
    markerColor: '#1e9696', // marker color : gray
    //projection: 'equirectangular',
    //Read more about available projections here
    //https://docs.mapbox.com/mapbox-gl-js/example/projections/
    inset: true,
    // inset: false,
    theme: 'dark',
    // use3dTerrain: false, //set true for enabling 3D maps.
    use3dTerrain: true, //set true for enabling 3D maps.

    // header information
    title: 'Projects',
    subtitle: '... subtitle ...',
    byline: 'By ...',
    footer: '&copy; National Yang Ming Chiao Tung University. Created using <a href="https://github.com/mapbox/storytelling" target="_blank">Mapbox Storytelling</a> template.',
    chapters: [{
            id: 'first-identifier',
            alignment: 'left',
            hidden: false,
            title: '',
            // image: './path/to/image/source.png',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud  ',
            location: {
                center: [120.380, 24.500],
                zoom: 7.5,
                pitch: 0,
                bearing: 0,
                // padding: { 'right': 400 }
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [
                // {
                //     layer: 'layer-name',
                //     opacity: 1,
                //     duration: 5000
                // }
            ],
            onChapterExit: [
                // {
                //     layer: 'layer-name',
                //     opacity: 0
                // }
            ],
            mediaType: 'none'
        },
        {
            id: 'second-identifier',
            alignment: 'left',
            hidden: false,
            title: '交大實景拍攝影像',
            // image: './path/to/image/source.png',
            description: 'Copy these sections to add to your story.',
            location: {
                // center: [120.9978, 24.7867],
                center: [120.9958, 24.7867],

                zoom: 15.5,
                pitch: 26,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [],
            onChapterExit: [],
            mediaType: 'image'
        }, {
            id: 'third-chapter',
            alignment: 'left',
            hidden: false,
            title: '空拍分析影像 白海豚',
            // image: './path/to/image/source.png',
            description: '拍攝標的物為白海豚。海豚為在本島西岸沿海較易出現的瀕臨絕種之生物，因此白海豚的永續發展為重要的議題之一，由於白海豚較不常見，此資料集也在搜集一定的困難度，此外由於白海豚在空拍影像中容易受海浪影像，造成特徵不明顯，因此在偵測上也有一定難度。附件為兩段含白海豚的空拍影像，可以自行下載標註使用。',
            location: {
                center: [120.470185, 24.311337],
                zoom: 12,
                pitch: 0,
                bearing: 0
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [],
            onChapterExit: [],
            mediaType: 'videoFile'
        }, {
            id: 'fourth-chapter',
            alignment: 'left',
            hidden: false,
            title: '無人機苗栗山區道路自主導航',
            // image: './path/to/image/source.png',
            description: '使用無人機進行苗栗山區道路自主導航，此處上傳導航路徑的csv檔，影片部分上傳至youtube，影片ID見CSV檔內',
            location: {
                center: [120.881246, 24.539507],
                zoom: 16,
                pitch: 20,
                bearing: 40
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [],
            onChapterExit: [],
            mediaType: 'video'
        },
        // {
        //     id: 'fifth-identifier',
        //     alignment: 'left',
        //     hidden: false,
        //     title: 'On the Sea',
        //     // image: './path/to/image/source.png',
        //     description: 'Copy these sections to add to your story.',
        //     location: {
        //         // center: [119.90898, 23.34897],
        //         center: [120.25865, 23.86453],
        //         zoom: 15,
        //         // pitch: 60,
        //         bearing: -30,
        //         pitch: 0,
        //         // bearing: 0,
        //         // flyTo additional controls-
        //         // These options control the flight curve, making it move
        //         // slowly and zoom out almost completely before starting
        //         // to pan.
        //         //speed: 2, // make the flying slow
        //         //curve: 1, // change the speed at which it zooms out
        //     },
        //     mapAnimation: 'flyTo',
        //     rotateAnimation: true,
        //     callback: '',
        //     onChapterEnter: [],
        //     onChapterExit: [],
        //     mediaType: 'none'
        // },
        {
            id: 'sixth-chapter',
            alignment: 'left',
            hidden: false,
            title: '群飛路徑視覺化測試資料',
            // image: './path/to/image/source.png',
            description: 'Copy these sections to add to your story.',
            location: {
                // center: [121.469, 23.701],
                center: [121.318873, 23.589414],
                zoom: 14.5,
                // pitch: 0,
                // pitch: 60,
                pitch: 30,
                bearing: -60.00
            },
            mapAnimation: 'flyTo',
            rotateAnimation: true,
            callback: '',
            onChapterEnter: [],
            onChapterExit: [],
            mediaType: 'none'
        }, {
            id: 'seventh-chapter',
            alignment: 'left',
            hidden: false,
            title: '台東多良車站即時影像',
            // image: './path/to/image/source.png',
            description: 'Taitung Amazing',
            location: {
                center: [120.96311, 22.50725],
                zoom: 14,
                pitch: 52,
                bearing: 180
            },
            mapAnimation: 'flyTo',
            rotateAnimation: false,
            callback: '',
            onChapterEnter: [],
            onChapterExit: [],
            mediaType: 'video'
        }
    ]
};