var mapManager  = {
    map: null,
    markers: [],
    infoWindow: null,
    defaultMapOptions: {
        center: {lat: 49.261011, lng: -123.153807},
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
        
        marker.setMap(this.map);
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
    },

    // Shows all markers
    showMarkers: function () {
        this.setMapOnAll(this.map);
    },
    
    // Delete all markers
    deleteMarkers: function () {
        this.hideMarkers();
        this.markers = [];
    },
    
    // Reset map center and zoom
    resetMap: function () {
        this.map.setCenter(this.defaultMapOptions.center);
        this.map.setZoom(this.defaultMapOptions.zoom);
    },
    
    displayTooltip: function (location, content) {
        this.infoWindow.setContent(content);
        this.infoWindow.setPosition(location);
        this.infoWindow.open(this.map);
    },
    
    onMapClick: function (handler) {
        this.map.addListener('click', handler);
    }
};
