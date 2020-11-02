var map = L.map('mapid').setView([62.53, 113.98], 13);

map.options.crs = L.CRS.EPSG3857;

L.Map.prototype.setCrs = function(newCrs) {
    this.options.crs = newCrs;
}

map.on('layeradd', function(layer) {
    // console.log('base change');
    // console.log(layer.name);
    var cen = map.getCenter();
    var zoom = map.getZoom();
    if(map.hasLayer(base_yandex)) {
        map.setCrs(L.CRS.EPSG3395);
        // console.log('ya');
    } else {
        map.setCrs(L.CRS.EPSG3857);
    }
    // map.setView(map.getCenter(),map.getZoom());
    map.setView(cen, zoom);
});

var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});
        
var base_osm = L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    opacity: 1.0,
    attribution: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors, CC-BY-SA</a>',
    minZoom: 1,
    maxZoom: 28,
    minNativeZoom: 0,
    maxNativeZoom: 19
});

var base_yandex = L.tileLayer('http://vec01.maps.yandex.net/tiles?l=map&x={x}&y={y}&z={z}', {
    opacity: 1.0,
    attribution: '',
    minZoom: 1,
    maxZoom: 28,
    minNativeZoom: 0,
    maxNativeZoom: 18
});

var base_toner = L.tileLayer.provider('Stamen.Toner');
var base_watercolor = L.tileLayer.provider('Stamen.Watercolor');

map.addLayer(base_osm);

var test_mapbox = L.tileLayer.provider('MapBox', {
    id : 'alexlipovka/ckgg7i4yz029v19oao7hyjdgx',
    accessToken : 'pk.eyJ1IjoiYWxleGxpcG92a2EiLCJhIjoiY2p5N21ybTUzMDEzdTNocDF2ZnF1dGN0ZiJ9.2fkd6wt4uOWM44Pxhf2daw',
});

var l_border = L.tileLayer.wms('geoserver/mirniy/wms', {
    layers: 'mirniy:border',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: 'СибЭнергоСбережение 2030',
    zIndex: 500,
});

map.addLayer(l_border);

var l_building_now = L.tileLayer.wms('geoserver/mirniy/wms', {
    layers: 'mirniy:building_now',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: 'СибЭнергоСбережение 2030',
    zIndex: 501,
});

map.addLayer(l_building_now);

var l_building_future = L.tileLayer.wms('geoserver/mirniy/wms', {
    layers: 'mirniy:building_future',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: 'СибЭнергоСбережение 2030',
    zIndex: 502,
});

map.addLayer(l_building_future);

var l_ts_pipe_2020 = L.tileLayer.wms('geoserver/mirniy/wms', {
    layers: 'mirniy:ts_pipe_2020',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: 'СибЭнергоСбережение 2030',
    zIndex: 502,
});

map.addLayer(l_ts_pipe_2020);


var baseMaps = [
    {
        groupName: 'Подложки',
        expanded: true,
        layers: {
            "OpenStreetMap" : base_osm,
            "Черно-белая" : base_toner,
            "Акварель" : base_watercolor,
            "Яндекс" : base_yandex,
        }
    }
];

var overlays = [
    {
        groupName: 'Исходные слои',
        expanded: true,
        layers: {
            '<img src = "/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png\
            &WIDTH=20&HEIGHT=20&LAYER=mirniy:border" /> \
            Границы' : l_border,
            '<img src = "/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png\
            &WIDTH=20&HEIGHT=20&LAYER=mirniy:building_now" /> \
            Застройка (существующая)' : l_building_now,
            '<img src = "/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png\
            &WIDTH=20&HEIGHT=20&LAYER=mirniy:building_future" /> \
            Застройка (перспективная)' : l_building_future,
        }
    } ,
    {
        groupName: 'Тепловая сеть (существущая)',
        expanded: false,
        layers: {
            '<img src = "/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png\
            &WIDTH=20&HEIGHT=20&LAYER=mirniy:ts_pipe_2020" />' : l_ts_pipe_2020,
        }
    }
];

var options = {
    container_width : "300px",
    group_maxHeight : "800px",
};

var control = L.Control.styledLayerControl(baseMaps, overlays, options);
map.addControl(control);