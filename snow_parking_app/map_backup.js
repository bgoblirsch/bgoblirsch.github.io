// This file should be split up into 3 files:
//  - UI Functions
//  - map Functions
//  - main() / code file


// ############ //
// ############ //
// UI Functions //
// ############ //
// ############ //

// THIS IS CURRENTLY NOT USED
// Set the width of the side navigation to 0 and the left margin of the page content to 0
function closeNav() {
  document.getElementById('info-area').style.width = '0';
  document.getElementById('map').style.marginLeft = '0';
}

// if (landscape) { "Day 1 Info v"} else {"Day 1"}
function changeDayButtonContent() {
  var dayButtons = document.getElementsByClassName('day-selector');
  if (isPortrait()) {
    for (i = 0; i < dayButtons.length; i++) {
      var dayNumber = dayButtons[i].value
      dayButtons[i].innerHTML = `Day ${dayNumber}`;
      //dayButtons[i].firstChild.innerHTML = `Day ${dayNumber}`;
    }
  } else {
    for (i = 0; i < dayButtons.length; i++) {
      var dayNumber = dayButtons[i].value;
      dayButtons[i].innerHTML = `Day ${dayNumber} Info <i class="fa fa-caret-down"></i>`;
    }
  }
}

function isPortrait() {
  if (window.screen.availHeight > window.screen.availWidth) {
    return true;
  }
  else { return false; }
}

// ############# //
// ############# //
// Map Functions //
// ############# //
// ############# //

// this is where I'd keep my map functions....if I had any...

// ############# //
// ############# //
//   Map Code    //
// ############# //
// ############# //

// Mapbox Token:
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

// geocoder object
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  mapboxgl: mapboxgl
});
var geocoderHTML = document.getElementById('geocoder');
geocoderHTML.appendChild(geocoder.onAdd(map));

// var displayZoom determines whether or not to include zoom controls on map
if (isPortrait()) {
  var displayZoom = false;
}
else {
  var displayZoom = true;
};
// Add compass to map (& zoom if landscape)
var nav = new mapboxgl.NavigationControl({showZoom: displayZoom});
map.addControl(nav, 'bottom-right');

// Add/remove zoom on orientation change
// Also resize the map
window.addEventListener("orientationchange", function() {
  map.removeControl(nav);
  displayZoom = !displayZoom;
  nav = new mapboxgl.NavigationControl({showZoom: displayZoom});
  map.addControl(nav, 'bottom-right');
  changeDayButtonContent()
  //if (!isPortrait) {
  //  document.getElementById('info-area').style.top = geoStatusHeight;
  //}
  var geoStatusHeight = document.getElementById('geo-status-fixed').offsetHeight;
  if (isPortrait()) {
    document.getElementById('map').style.top = geoStatusHeight;
  } else {
    document.getElementById('info-area').style.top = geoStatusHeight;
  }
});

if (!isPortrait()) {
  document.getElementById('map').style.top = 0;
}

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

var geoStatusHeight = document.getElementById('geo-status-fixed').offsetHeight;
if (isPortrait) {
  document.getElementById('map').style.top = geoStatusHeight;
} else {
  document.getElementById('info-area').style.top = geoStatusHeight;
}


changeDayButtonContent();
map.on('load', function () {
  // Add road data
  // map.addSource(snow_route_data);
  map.addLayer(testData);
  document.getElementById('day1-selector').click();
  geolocate.trigger();
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
      this.classList.toggle('active');
      dropdownContent.style.display = 'none';
      map.setLayoutProperty('test-data', 'visibility', 'none');
    }
    else {
      // else loop through all buttons, deactive them, and hide content accordingly
      for (j = 0; j < dropdown.length; j++) {
        if (dropdown[j].classList.value.includes('active')) {
          dropdown[j].classList.toggle('active');
          var iterDropdownContent = dropdown[j].nextElementSibling;
          iterDropdownContent.style.display = 'none';
          console.log('closeMapLayers();');
        }
      }
      // Now "turn on" the clicked button and activate its map layer
      // also rotate the arrow
      this.classList.toggle('active');
      dropdownContent.style.display = 'block';
      if (!isPortrait()) {
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

// Add a listener for geocoder focus
geocoderHTML.addEventListener('focus', function() {
  if (isPortrait) {
    // Get HTML head element
    var head = document.getElementsByTagName('HEAD')[0];

    // Create new link Element
    var link = document.createElement('link');

    // set the attributes for link element
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'css/portrait-styles.css';

    // Append link element to HTML head
    head.appendChild(link);
    // prevent screen rotation
  }
  else {
    // expand sidebar to ~40% screen width or do nothing???
  }
})
