// ############ //
// ############ //
// UI Functions //
// ############ //
// ############ //

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById('info-area').style.width = '0';
  document.getElementById('map').style.marginLeft = '0';
}

function closeMapLayers() {
  // map.removeLayer(testData);
}

function changeDayButtonContent() {
  var dayButtons = document.getElementsByClassName('day-selector');
  if (window.screen.availHeight > window.screen.availWidth) {
    for (i = 0; i < dayButtons.length; i++) {
      var dayNumber = dayButtons[i].value
      dayButtons[i].innerHTML = `Day ${dayNumber}`;
      //dayButtons[i].firstChild.innerHTML = `Day ${dayNumber}`;
    }
  } else {
    for (i = 0; i < dayButtons.length; i++) {
      var dayNumber = dayButtons[i].value;
      //var textInsert = `Day ${dayNumber} Info` + "<i class='fa fa-caret-down'></i>";
      //console.log(textInsert);
      dayButtons[i].innerHTML = `Day ${dayNumber} Info <i class="fa fa-caret-down"></i>`;
      //dayButtons[i].parentElement.appendChild("<i class='fa fa-caret-down'></i>")
    }
  }
}

// ############# //
// ############# //
// Map Functions //
// ############# //
// ############# //

/*
function drawMapLayer(day) {
  switch (day) {
    case 1:
      map.addLayer(testData)
  }
}
*/

// ############# //
// ############# //
//   Map Code    //
// ############# //
// ############# //

mapboxgl.accessToken = 'pk.eyJ1IjoiYmdvYmxpcnNjaCIsImEiOiJjanpybWFsNWcxY3dnM21vNXZmN21lcXNrIn0.MwA-tEeJpUwITy7wkPwYJA';
// Minneapolis City Boundary Extent
var city_boundary = [
  [-93.32916,45.05125],
  [-93.19386,44.89015]
];

var geoStatusHeight = document.getElementById('geo-status-fixed');

// initialize map
var map = new mapboxgl.Map({
  container: 'map', // container id
  style: 'mapbox://styles/mapbox/dark-v10', // stylesheet location
  center: [-93.27, 44.98], // starting position [lng, lat]
  zoom: 11, // starting zoom
  minZoom: 11
});

// document.getElementById('map').style.top = geoStatusHeight;

// geocoder object
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
});
document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// Set Screen state
// Add compass to the map; zoom if landscape.
if (window.screen.availHeight > window.screen.availWidth) {
  screenState = 'portrait';
  var displayZoom = false;
}
else {
  screenState = 'landscape';
  var displayZoom = true;
};

// Add zoom controlls
var nav = new mapboxgl.NavigationControl({showZoom: displayZoom});
map.addControl(nav, 'bottom-right');


// Add/remove zoom on orientation change
window.addEventListener("orientationchange", function() {
  map.removeControl(nav);
  displayZoom = !displayZoom;
  nav = new mapboxgl.NavigationControl({showZoom: displayZoom});
  map.addControl(nav, 'bottom-right');
  changeDayButtonContent()
});

// Disable Map Rotation. Touch Rotation is still enabled, this is just to dissuade tilting.
map.dragRotate.disable();

// Add geolocate control to the map.
var geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true
});
map.addControl(geolocate, 'bottom-right');

map.fitBounds(city_boundary);

var testData = {
  "id": "test-data",
  "type": "line",
  "source": {
    type: 'vector',
    url: 'mapbox://bgoblirsch.ck0emp5hw00mr2ipzztgtsxl6-17ccf'
  },
  "source-layer": "streetcarLines",
  "layout": {
    "line-join": "round",
    "line-cap": "round"
  },
  "paint": {
    "line-color": "#ff69b4",
    "line-width": 1
  }
};

changeDayButtonContent();
map.on('load', function () {
  // Add road data
  // map.addSource(snow_route_data);
  map.addLayer(testData);
  document.getElementById('day1-selector').click();
  // if (y > x) {prompt for location} else {point at search}
});

// ############ //
// ############ //
//   UI Code    //
// ############ //
// ############ /

//* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content
// This allows the user to have multiple dropdowns without any conflict */

var dropdown = document.getElementsByClassName('day-selector');
var officialLink = document.getElementById('official-link');
var i;

// Add click event listener on the three dropdown buttons
for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener('click', function() {
    var dropdownContent = this.nextElementSibling;
    // Check to see if the clicked button is active
    if (this.classList.value.includes('active')) {
      // if so, deactivate and hide content
      this.classList.toggle('active')
      dropdownContent.style.display = 'none';
      //console.log('closeMapLayers();')
      map.setLayoutProperty('test-data', 'visibility', 'none')
    }
    else {
      // else loop through all buttons, deactive them, and hide their content
      for (j = 0; j < dropdown.length; j++) {
        if (dropdown[j].classList.value.includes('active')) {
          dropdown[j].classList.toggle('active');
          var iterDropdownContent = dropdown[j].nextElementSibling;
          iterDropdownContent.style.display = 'none';
          console.log('closeMapLayers();');
        }
      }
      // Now "turn on" the clicked button and activate its map layer
      this.classList.toggle('active');
      dropdownContent.style.display = 'block';
      if (window.screen.availWidth > window.screen.availHeight) {
        this.parentElement.scrollIntoView();
      }
      var lineColor;
      if (this.value == 1) {
        lineColor = 'green';
      } else if (this.value == 2) {
        lineColor = 'red';
      }
      else {
        lineColor = 'yellow';
      }

      map.setPaintProperty('test-data', 'line-color', lineColor);
      if (map.getLayoutProperty('test-data', 'visibility') == 'none') {
        map.setLayoutProperty('test-data', 'visibility', 'visible');
      }

      console.log('pass the following parameter to drawMapLayer():');
      console.log(this.value);
    }
  });
}
