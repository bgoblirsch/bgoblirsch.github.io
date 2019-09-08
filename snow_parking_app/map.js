// Handles all JS related to the Map object

mapboxgl.accessToken = 'pk.eyJ1IjoiYmdvYmxpcnNjaCIsImEiOiJjanpybWFsNWcxY3dnM21vNXZmN21lcXNrIn0.MwA-tEeJpUwITy7wkPwYJA';
// Minneapolis City Boundary Extent
var city_boundary = [
  [-93.32916,45.05125],
  [-93.19386,44.89015]
];

// initialize map
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
  center: [-93.27, 44.98], // starting position [lng, lat]
  zoom: 11, // starting zoom
  minZoom: 11
});

var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// Disable Map Rotation. Touch Rotation is still enabled, this is just to dissuade tilting.
map.dragRotate.disable();

// Add zoom and compass to the map.
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'bottom-right');


// Add geolocate control to the map.
var geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
});
map.addControl(geolocate, 'bottom-right');

map.fitBounds(city_boundary);

map.on('load', function () {
  // Add road data
  // map.addSource();

});
