var map;
var ajaxRequest;
var plotList;
var plotLayers=[];
var locMarker;
var focus = null;


function clearResults() {
	if (map.hasLayer(locMarker)) {
		map.removeLayer(locMarker);
	}
	$('#results').empty();
}

function initMap() {
	map = new L.Map('map', { zoomControl:false });
	map.doubleClickZoom.disable();
	//map.scrollWheelZoom.disable();
	//map.dragging.disable();
	//map.touchZoom.disable();
	map.keyboard.disable();
	if (map.tap) map.tap.disable();

	//var MNGeoImagery = L.tileLayer.wms('http://geoint.lmic.state.mn.us/cgi-bin/wms?',{
  //          attribution:'MnGeo Image Service',
	//		layers: 'met16'
	//}).addTo(map);
	L.esri.basemapLayer('Imagery').addTo(map);


  new L.Control.Zoom({ position: 'topright' }).addTo(map);


	//map.fitBounds(geojsonStreetcarLines.getBounds());

	streetLabels = L.esri.basemapLayer('ImageryTransportation').addTo(map);
	map.removeLayer(streetLabels)
	geojsonStreetcarLines = L.geoJson(window.scLines, {style: styleStreetcarLines, onEachFeature:onEachLine}).addTo(map);
	L.esri.basemapLayer('ImageryLabels').addTo(map);

  map.setView([44.954412, -93.214082],12);

	map.on('zoomend', function() {
		if (map.getZoom() >= 16) {
			map.addLayer(streetLabels);
		}
		if (map.getZoom() < 16) {
			map.removeLayer(streetLabels);
		}
	});
}

function zoomCheck() {

}

function onEachLine(features, layer) {
	layer.on({
		mouseover: highlightLine,
		mouseout: resetLine,
		click: focusLine
	});
}

function styleStreetcarLines(feature) {
	return {
		color: feature.properties.line_color,
		weight: 3
	};
};

function highlightLine(e) {
	var layer = e.target;
	layer.setStyle({
		weight:5
	});
	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		if (focus != null) {
			layer.bringToFront();
			focus.bringToFront();
		}
		else {
			layer.bringToFront();
		//layer.bringToFront();
		}
	}
}

function resetLine(e) {
	var layer = e.target;
	if (layer != focus) {
		geojsonStreetcarLines.resetStyle(e.target);
	}
}

function focusLine(e) {
	if (focus != null) {
		geojsonStreetcarLines.resetStyle(focus);
	}
	var layer = e.target;
	focus = e.target;
	map.fitBounds(e.target.getBounds());
	layer.bringToFront();
	layer.setStyle({
		weight:5
	})
}
