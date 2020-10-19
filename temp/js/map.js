var map = L.map('mapid').setView([56, 93], 13);

var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});
        
var base_osm = L.tileLayer('http://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    opacity: 1.0,
    attribution: '<a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors, CC-BY-SA</a>',
    minZoom: 1,
    maxZoom: 28,
    minNativeZoom: 0,
    maxNativeZoom: 19
});

var test_mapbox = L.tileLayer.provider('MapBox', {
    id : 'alexlipovka/ckgg7i4yz029v19oao7hyjdgx',
    accessToken : 'pk.eyJ1IjoiYWxleGxpcG92a2EiLCJhIjoiY2p5N21ybTUzMDEzdTNocDF2ZnF1dGN0ZiJ9.2fkd6wt4uOWM44Pxhf2daw',
});

var test_postgis = L.tileLayer.wms('http://localhost:8080/geoserver/cite/wms', {
    layers: 'cite:building_kras',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
    attribution: "СФУ ГИС"
});


var base_toner = L.tileLayer.provider('Stamen.Toner');
var base_watercolor = L.tileLayer.provider('Stamen.Watercolor');

map.addLayer(base_toner);

map.createPane('pane_building');
map.getPane('pane_building').style.zIndex = 401;
map.getPane('pane_building').style['mix-blend-mode'] = 'normal';

function style_building(feature) {
    if(feature.properties['h'] > 3) {
        return {
            color: "#202020",
            fillColor: "#808080",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        }
    } else {
        return {
            color: "#202020",
            fillColor: "#d7d7d7",
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        }
    }
};

function pop_building(feature, layer) {
    var popupContent = L.responsivePopup().setContent('<table>\
            <tr>\
                <th scope="row">№ дома</th>\
                <td>' + (feature.properties['addr_link'] !== null ? autolinker.link(feature.properties['addr_link'].toLocaleString()) : '') + '</td>\
            </tr>\
            <tr>\
                <th scope="row">Этажность</th>\
                <td>' + (feature.properties['h'] !== null ? autolinker.link(feature.properties['h'].toLocaleString()) : '') + '</td>\
            </tr>\
        </table>');
    layer.bindPopup(popupContent, {maxHeight: 400});
}

var over_building = L.geoJson(json_building, {
    attribution: '',
    interactive: true,
    pane: 'pane_building',
    style: style_building,
    onEachFeature: pop_building,
    dataVar: 'json_building',
    layerName: 'over_building',
});

var baseMaps = [
    {
        groupName: "Подложки",
        expanded: true,
        layers: {
            "OpenStreetMap" : base_osm,
            "Черно-белая" : base_toner,
            "Акварель" : base_watercolor,
        }
    }
];

var overlays = [
    {
        groupName: "Исходные слои",
        expanded: true,
        layers: {
            "Пример MapBox" : test_mapbox,
            "Пример Postgis" : test_postgis,
            'Застройка<br />\
            <table>\
                <tr>\
                    <td width="20"></td>\
                    <td style="text-align: center;"><img src="legend/building_1_110.png" /></td>\
                    <td>Малоэтажная</td>\
                </tr>\
                <tr>\
                    <td width="20"></td>\
                    <td style="text-align: center;"><img src="legend/building_1_131.png" /></td>\
                    <td>Среднеэтажная</td>\
                </tr>\
                <tr>\
                    <td width="20"></td>\
                    <td style="text-align: center;"><img src="legend/building_1_372.png" /></td>\
                    <td>3 - 7</td>\
                </tr>\
                <tr>\
                    <td width="20"></td>\
                    <td style="text-align: center;"><img src="legend/building_1_7103.png" /></td>\
                    <td>7 - 10</td>\
                </tr>\
                <tr>\
                    <td width="20"></td>\
                    <td style="text-align: center;"><img src="legend/building_1_10174.png" /></td>\
                    <td>10 - 17</td>\
                </tr>\
            </table>' : over_building,
        }
    }
];

// L.control.layers(baseMaps,{
//     '<img src="legend/border_geo_2.png" /> border_geo': layer_border_geo_2,
//     'building этажность<br /><table><tr><td style="text-align: center;"><img src="legend/building_1_110.png" /></td><td>1 - 1</td></tr><tr><td style="text-align: center;"><img src="legend/building_1_131.png" /></td><td>1 - 3</td></tr><tr><td style="text-align: center;"><img src="legend/building_1_372.png" /></td><td>3 - 7</td></tr><tr><td style="text-align: center;"><img src="legend/building_1_7103.png" /></td><td>7 - 10</td></tr><tr><td style="text-align: center;"><img src="legend/building_1_10174.png" /></td><td>10 - 17</td></tr></table>': layer_building_1,
//     "OSM Standard": layer_OSMStandard_0,
// },{
//     collapsed:false
// }).addTo(map);

var options = {
    container_width 	: "200px",
    group_maxHeight : "800px",
};

var control = L.Control.styledLayerControl(baseMaps, overlays, options);
map.addControl(control);