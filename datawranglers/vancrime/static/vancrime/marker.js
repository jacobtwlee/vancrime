function addMarker(type, address, latlng, map) {
  // TODO: this url should somehow use a globally defined STATIC_URL (see datawranglers/settings.py)
  // change this URL to use the desired icon
  var marker = new google.maps.Marker({
      position: latlng,
      title: type,
      icon: getCrimeIconURL(type)
    });

  marker.setMap(map);
  marker.addListener('click', function() {
  	infowindow.setContent('<p>Crime: ' + type + '</p><p>Address: ' + address + '</p>');
    infowindow.open(map, marker);
  });
}

function getCrimeIconURL(crimeType) {
  switch(crimeType) {
      case 'Commercial Break and Enter':
          return '/static/vancrime/assets/gmaps-icons/red-dot.png';
      case 'Mischief Over $5000':
      case 'Mischief Under $5000':
          return '/static/vancrime/assets/gmaps-icons/blue-dot.png';
      case 'Theft From Auto Under $5000':
      case 'Theft From Auto Over  $5000':
      case 'Theft Of Auto Under $5000':
      case 'Theft Of Auto Over $5000':
        return '/static/vancrime/assets/gmaps-icons/green-dot.png';
      default:
          return '/static/vancrime/assets/gmaps-icons/red-dot.png';
  }
}
