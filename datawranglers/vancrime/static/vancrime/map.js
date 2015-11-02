function initMap() {
  var mapOptions = {
  	center: {lat: 49.261011, lng: -123.153807},
  	zoom: 13,
  	streetViewControl: false,
  	mapTypeControl: false
  }
  return new google.maps.Map(document.getElementById('map'), mapOptions);
}

function addMarker(latlng, type, map) {
  // TODO: this url should somehow use a globally defined STATIC_URL (see datawranglers/settings.py)
  // change this URL to use the desired icon
  var image = '/static/vancrime/assets/gmaps-icons/red-dot.png'
  marker = new google.maps.Marker({
      position: latlng,
      title: 'Crime type: ' + type,
      icon: image
    });

  marker.setMap(map);
}
