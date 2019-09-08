/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
  document.getElementById("sidenav").style.width = "240px";
  document.getElementById("map").style.marginLeft = "240px";
}

/* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("map").style.marginLeft = "0";
}

function closeMapLayers() {
  // close/hide whatever map layer is active
}

function drawMapLayer(day) {
  // turn on the layer of parameter day
}

//* Loop through all dropdown buttons to toggle between hiding and showing its dropdown content
// This allows the user to have multiple dropdowns without any conflict */
var dropdown = document.getElementsByClassName('day-selector');
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
      console.log('closeMapLayers();')
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
      this.classList.toggle('active');
      dropdownContent.style.display = 'block';
      console.log('pass the following parameter to drawMapLayer():')
      console.log(this.value)
    }
  });
}

/*
    for (j = 0; j < dropdown.length; j++) {
      // call closeMapLayers();
      var classList = dropdown[j].classList.value;
      console.log();
      if (classList.includes('active')) {
        dropdown[j].classList.toggle('active');
        var dropdownContent = dropdown[j].nextElementSibling;
        dropdownContent.style.display = 'none'
        // turn off this day's map layer
      }

    }
    //this.classList.toggle('active');
    var dropdownContent = this.nextElementSibling;
    if (dropdownContent.style.display === 'block') {
      dropdownContent.style.display = 'none';
      // turn off this day's map layer
    } else {
      dropdownContent.style.display = 'block';
      // turn on this day's map layer
    }
  });
}
*/

document.getElementById('day1-selector').click()

openNav()

// Old Data Structure; still need info property
/*
var day1_info = {
  day: '1',
  parking_time: '9 PM - 8 AM',
  message_do: 'Park in any valid parking spot on non-Snow-Emergency-Routes.',
  message_dont: 'Do not park on either side of a Snow Emergency Route.',
  info: 'Snow Energency Routes can be identified by a blue street sign and the red/white Snow Emergency Routes sign.',
}

var day2_info = {
  day: '2',
  parking_time: '8 AM - 8 PM',
  message_do: 'Park on either side of Snow Emergency Routes or the Odd side of non-Snow Emergency Routes.',
  message_dont: 'Do not park on the EVEN side of non-Snow Emergency Routes.',
  info: 'Look for house numbers that end in even numbers to identify the even side of the street.',
}

var day3_info = {
  day: '3',
  parking_time: '8 AM - 8 PM',
  message_do: 'Park on either side of Snow Emergency Routes or the EVEN side of non-Snow Emergency Routes.',
  message_dont: 'Do not park on the ODD side of non-Snow Emergency Routes.',
  info: 'Look for house numbers that end in odd numbers to identify the even side of the street.',
}
*/
