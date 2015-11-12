var mapManager  = {
    map: null,
    markersAreVisible: true,
    markers: [],
    infoWindow: null,
    defaultMapOptions: {
        center: {lat: 49.255930, lng: -123.142319},
        zoom: 13,
        streetViewControl: false,
        mapTypeControl: false
    },
    
    // Initialize the map centred on Vancouver
    initMap: function () {
        this.map = new google.maps.Map(document.getElementById('map'), this.defaultMapOptions);
        this.infoWindow = new google.maps.InfoWindow({content: ''});
    },
    
    // Add a marker to the map
    addMarker: function (location, title, icon, content) {
        var self = this;
        
        var marker = new google.maps.Marker({
            position: location,
            title: title,
            icon: icon
        });
        
        var map = this.markersAreVisible ? this.map : null;
        
        marker.setMap(map);
        marker.addListener('click', function() {
            self.infoWindow.setContent(content);
            self.infoWindow.open(this.map, marker);
        });
        
        this.markers.push(marker);
    },
    
    // Sets the map for all markers
    setMapOnAll: function (map) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    },
    
    // Hide all markers
    hideMarkers: function () {
        this.setMapOnAll(null);
        this.markersAreVisible = false;
    },

    // Shows all markers
    showMarkers: function () {
        this.setMapOnAll(this.map);
        this.markersAreVisible = true;
    },
    
    // Delete all markers
    deleteMarkers: function () {
        this.setMapOnAll(null);
        this.markers = [];
    },
    
    // Set the centre and zoom of the map
    setLocationAndZoom: function (location, zoom) {
        this.map.setCenter(location);
        this.map.setZoom(zoom);
    },
    
    // Reset map center and zoom
    resetMap: function () {
        this.map.setCenter(this.defaultMapOptions.center);
        this.map.setZoom(this.defaultMapOptions.zoom);
    },
    
    // Display map tooltip at location with content
    displayTooltip: function (location, content) {
        this.infoWindow.setContent(content);
        this.infoWindow.setPosition(location);
        this.infoWindow.open(this.map);
    },
    
    // Add a click handler to the map
    onMapClick: function (handler) {
        this.map.addListener('click', handler);
    }
};
