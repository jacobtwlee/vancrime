function initMap() {
  var mapOptions = {
  	center: {lat: 49.261011, lng: -123.153807},
  	zoom: 13,
  	streetViewControl: false,
  	mapTypeControl: false
  }
  return new google.maps.Map(document.getElementById('map'), mapOptions);
}
