
// Extracted from your GeoJSON
const coords = [
  [-74.0947879, 41.1627607],
  [-74.0829862, 41.1619853],
  [-74.084102, 41.1541338],
  [-74.0908397, 41.1501915],
  [-74.0988648, 41.1506762],
  [-74.0994656, 41.1496422],
  [-74.0968584, 41.1370341],
  [-74.0887903, 41.136323],
  [-74.0832542, 41.1362583],
  [-74.0865587, 41.1241043],
  [-74.0889099, 41.1153613],
  [-74.0814748, 41.1157574],
  [-74.0814104, 41.1146823],
  [-74.0806487, 41.1147147],
  [-74.0806165, 41.1143509],
  [-74.0814212, 41.1143024],
  [-74.0814158, 41.1135062],
  [-74.0821078, 41.1134941],
  [-74.0820595, 41.1097919],
  [-74.0809759, 41.1098242],
  [-74.0809545, 41.1090967],
  [-74.081963, 41.1019422],
  [-74.08295, 41.1013116],
  [-74.0819201, 41.0965576],
  [-74.0826711, 41.094601],
  [-74.0829071, 41.0900082],
  [-74.0826496, 41.0894584],
  [-74.0805897, 41.0884557],
  [-74.0805039, 41.0869031],
  [-74.0789804, 41.0863047],
  [-74.0812549, 41.082795],
  [-74.0815982, 41.080563],
  [-74.0818557, 41.077231],
  [-74.1173038, 41.0929515],
  [-74.1296312, 41.0984091],
  [-74.1291806, 41.1005112],
  [-74.1283652, 41.1003899],
  [-74.1283437, 41.0997755],
  [-74.1272923, 41.099824],
  [-74.1265091, 41.102209],
  [-74.1282686, 41.1030417],
  [-74.1262838, 41.106429],
  [-74.1255542, 41.1069707],
  [-74.1265949, 41.1059036],
  [-74.1246369, 41.1054226],
  [-74.1229927, 41.1078619],
  [-74.1248166, 41.1094625],
  [-74.1303742, 41.1113217],
  [-74.1310179, 41.1116936],
  [-74.1310501, 41.1124534],
  [-74.1363501, 41.1122998],
  [-74.1319298, 41.1210616],
  [-74.1287327, 41.1203018],
  [-74.1276383, 41.1213364],
  [-74.1271448, 41.1230659],
  [-74.1282499, 41.1235185],
  [-74.1287756, 41.1248116],
  [-74.129709, 41.124852],
  [-74.132241, 41.1247551],
  [-74.1301274, 41.1248278],
  [-74.1300952, 41.1243591],
  [-74.1323375, 41.1238176],
  [-74.1330349, 41.1238499],
  [-74.133507, 41.1243106],
  [-74.135524, 41.1238337],
  [-74.1359639, 41.1230336],
  [-74.1407382, 41.1260481],
  [-74.1430801, 41.1275673],
  [-74.1052288, 41.1629708],
  [-74.0947879, 41.1627607]
];

  const districtGeoJSON = {
    type: "Polygon",
    coordinates: coords
  };

  // Initialize autocomplete when the page loads
  let autocomplete;
  function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('address'),
      {
        types: ['address'],
        componentRestrictions: { country: 'us' }
      }
    );
    
    // Add listener for place selection
    autocomplete.addListener('place_changed', function() {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        // Automatically check the address when user selects from autocomplete
        checkSelectedPlace(place);
      }
    });
  }

  function checkSelectedPlace(place) {
    const location = place.geometry.location;
    const point = turf.point([location.lng(), location.lat()]);
    const polygon = turf.polygon([districtGeoJSON.coordinates]);

    const inside = turf.booleanPointInPolygon(point, polygon);
    document.getElementById('result').style.display = 'block';
    document.getElementById('result').innerHTML =
    inside ? '<p>You\'re located within Tallman Fire District.</p> <ul>\
    <li><a href="https://voterlookup.elections.ny.gov" target="_blank">Registration Status</a></li> \
    <li><a href="https://elections.ny.gov/voter-registration-process" target="_blank">Register to vote</a></li> \
    <li><a href="https://chat.whatsapp.com/CV7rMftauLY3JrCOF6I8o9" target="_blank">Whatsapp Community</a></li></ul>' : '<p>You\'re outside the district. Your support is still appreciated.</p>';
    // Log the address
    document.getElementsByClassName('search-bar-content')[0].style.display = 'none';
  // Log the address
  logSubmission(place.formatted_address, inside);

  }

function logSubmission(address, insideDistrict) {
  fetch("https://script.google.com/macros/s/AKfycbwXu1v_NorWZi0As5vzFBdrNWt09HSHcWs9xo_GnEL3-Z4zlJpLdsm0c7xek81vyLFYXQ/exec", {
    method: "POST",
    body: JSON.stringify({
      address: address,
      inDistrict: insideDistrict
    }),
    headers: {
      "Content-Type": "text/plain"
    }
  })
  .then(response => response.text())
  .then(data => console.log("Logged:", data))
  .catch(err => console.error("Error logging:", err));
}


function checkAddress() {
  const address = document.getElementById('address').value;
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: address }, function(results, status) {
    if (status === 'OK') {
      const location = results[0].geometry.location;
      const point = turf.point([location.lng(), location.lat()]);
      const polygon = turf.polygon([districtGeoJSON.coordinates]);

      const inside = turf.booleanPointInPolygon(point, polygon);
      document.getElementById('result').style.display = 'block';
      document.getElementById('result').innerHTML =
      inside ? '<p>You\'re located within Tallman Fire District.</p> <ul>\
      <li><a href="https://voterlookup.elections.ny.gov" target="_blank">Registration Status</a></li> \
      <li><a href="https://elections.ny.gov/voter-registration-process" target="_blank">Register to vote</a></li> \
      <li><a href="https://chat.whatsapp.com/CV7rMftauLY3JrCOF6I8o9" target="_blank">Whatsapp Community</a></li></ul>' : '<p>You\'re outside the district. Your support is still appreciated.</p>';
      // Log the address
      document.getElementsByClassName('search-bar-content')[0].style.display = 'none';
      logSubmission(address, inside);
    } else {
      document.getElementById('result').textContent = 'Geocoding failed: ' + status;
    }
  });
}

function handleSubmit() {
  checkAddress();
}

// Initialize autocomplete when the page loads
window.onload = function() {
  initAutocomplete();
};

document.addEventListener('DOMContentLoaded', function () {
  var faqList = document.querySelectorAll('#faqs li');
  faqList.forEach(function(li) {
    li.addEventListener('click', function(e) {
      // Optional: prevent selection on link click inside FAQ
      if (e.target.tagName.toLowerCase() === 'a') return;
      this.classList.toggle('active');
    });
  });
});


// Counter
const counter = document.querySelector('.counter');
const target = +counter.dataset.target;
let started = false;

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !started) {
      started = true;
      let count = 0;
      const duration = 800;
      const increment = target / (duration / 16);
      const step = () => {
        count += increment;
        if (count < target) {
          counter.textContent = Math.floor(count);
          requestAnimationFrame(step);
        } else {
          counter.textContent = target;
        }
      };
      step();
    }
  });
});

observer.observe(counter);

// Map
const customMapStyle = [
  {
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffbdbd"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffb8b8"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#ffb8b8"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ededed"
      }
    ]
  }
];

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 41.1228, lng: -74.0960 },
    zoom: 13,
    styles: customMapStyle,
  });

  const outline = new google.maps.Polygon({
    paths: coords.map(coord => new google.maps.LatLng(coord[1], coord[0])),
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 3,
    fillColor: '#FF0000',
    fillOpacity: 0.2,
  });

  outline.setMap(map);
}
initMap();