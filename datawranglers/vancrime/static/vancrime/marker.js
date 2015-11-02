function addMarker(latlng, type, map) {
  // TODO: this url should somehow use a globally defined STATIC_URL (see datawranglers/settings.py)
  // change this URL to use the desired icon
  marker = new google.maps.Marker({
      position: latlng,
      title: 'Crime type: ' + type,
      icon: getCrimeIconURL(type)
    });
  marker.setMap(map);
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