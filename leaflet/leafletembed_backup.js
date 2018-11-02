var map;
var ajaxRequest;
var plotList;
var plotLayers=[];
var currentState;
var currentCounty;
var zoomLevel;


function initMap() {
	map = new L.Map('map', { zoomControl:false });
	map.doubleClickZoom.disable();
	//map.scrollWheelZoom.disable();
	//map.dragging.disable();
	map.touchZoom.disable();
	map.keyboard.disable();
	if (map.tap) map.tap.disable();

	var Esri_WorldGrayCanvas = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
	});


	//var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	//var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	//var osm = new L.TileLayer(osmUrl, {attribution: osmAttrib});

	map.setView(new L.LatLng(39.833, -98.583),5);
	map.addLayer(Esri_WorldGrayCanvas);

	geojson = L.geoJson(window.states, {style: styleState, onEachFeature: onEachState}).addTo(map);
	geojsonCounties = L.geoJson(window.counties, {style: styleCounty, onEachCounty: onEachCounty}).addTo(map);
	geojsonCounties.bringToBack();

	zoomLevel = 0;
}

// determine if a project exists in the state and return true if so
//function containsProject(state) {
	//if (state.project)
//	return true;
//}

// placeholder for above function, but testing if state name contains the letter 'A'
function getColor(name) {
	letter = 'a';
	if (name.includes(letter))
	{
		return '#71afb6'
	} else {
		return 'transparent'
	}
}

function styleState(feature) {
	return {
		fillColor: '#71afb6',
		weight: 2,
		color: '#4c721d',
		fillOpacity: 0.7
	};
}

function styleCounty(features) {
	return {
		fillColor: 'transparent',
		weight: 1,
		color: 'transparent'
	}
}


function highlightState(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#78a22e'
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
}

function highlightCounty(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 3,
		color: '#71afb6'
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}
}

function resetState(e) {
	var layer = e.target;
	if (zoomLevel == 0 || layer != currentState) {
		geojson.resetStyle(e.target);
	}
	if (currentState != null) {
		currentState.bringToFront();
	}
}

function resetCounty(e) {
	var layer = e.target;
	if (zoomLevel == 1 || layer != currentCounty) {
		geojsonCounties.resetStyle(e.target);
	}
	if (currentCounty != null) {
		currentCounty.bringToFront();
	}
}

function zoomState(e) {
	var layer = e.target;
	if (zoomLevel == 0) {
		console.log('zoom in to state');
		currentState = layer;
		layer.setStyle({
			weight: 5,
			color: '#78a22e',
			fillColor: 'transparent'
		});
		map.fitBounds(e.target.getBounds());
		zoomLevel = 1;
		geojsonCounties.bringToFront();
		geojsonCounties.setStyle({color: '#666'});
	} else if (layer == currentState) {
		console.log('unzoom');
		geojson.resetStyle(currentState);
		map.setView(new L.LatLng(39.833, -98.583),5);
		zoomLevel = 0;
		currentState = null;
		geojsonCounties.setStyle({color: 'transparent'});
		geojsonCounties.bringToBack();
	} else if (layer != currentState) {
		console.log('change state');
		geojson.resetStyle(currentState);
		currentState = layer;
		layer.setStyle({
			weight: 5,
			color: '#78a22e',
			fillColor: 'transparent'
		});
		map.fitBounds(e.target.getBounds());
		zoomLevel = 1;
	} else {
		console.log('something went horribly wrong');
	}
}

function zoomCounty(e) {
	var layer = e.target;
	if (zoomLevel == 1) {
		console.log('zoom in to county');
		currentCounty = layer;
		layer.setStyle({
			weight: 1,
			color: '#666'
		});
		map.fitBounds(e.target.getBounds());
		zoomLevel = 2;

	} else if (layer == currentCounty) {
		console.log('unzoom from county');
		geojsonCounty.resetStyle(currentCounty);
	}
}

function onEachCounty(features, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomCounty
	});
}

function onEachState(state, layer) {
	layer.on({
		mouseover: highlightState,
		mouseout: resetState,
		click: zoomState
	});
}
