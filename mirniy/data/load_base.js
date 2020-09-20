function pop__1(feature, layer) {
	layer.on({
		mouseout: function(e) {
			for (i in e.target._eventParents) {
				e.target._eventParents[i].resetStyle(e.target);
			}
		},
		mouseover: highlightFeature,
	});
	var popupContent = '<table>\
			<tr>\
				<th scope="row">Улица</th>\
				<td>' + (feature.properties['A_STRT    '] !== null ? autolinker.link(feature.properties['A_STRT    '].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">№</th>\
				<td>' + (feature.properties['A_HSNMBR  '] !== null ? autolinker.link(feature.properties['A_HSNMBR  '].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Этажность</th>\
				<td>' + (feature.properties['B_LEVELS  '] !== null ? autolinker.link(feature.properties['B_LEVELS  '].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Название</th>\
				<td>' + (feature.properties['vrem      '] !== null ? autolinker.link(feature.properties['vrem      '].toLocaleString()) : '') + '</td>\
			</tr>\
		</table>';
	layer.bindPopup(popupContent, {maxHeight: 400});
}

function style__1_0() {
	return {
		pane: 'pane__1',
		stroke: false, 
		fill: true,
		fillOpacity: 1,
		fillColor: 'rgba(183,183,183,1.0)',
		interactive: true,
	}
}
map.createPane('pane__1');
map.getPane('pane__1').style.zIndex = 401;
map.getPane('pane__1').style['mix-blend-mode'] = 'normal';
var layer__1 = new L.geoJson(json__1, {
	attribution: '',
	interactive: true,
	dataVar: 'json__1',
	layerName: 'layer__1',
	onEachFeature: pop__1,
	style: style__1_0,
});
bounds_group.addLayer(layer__1);
map.addLayer(layer__1);