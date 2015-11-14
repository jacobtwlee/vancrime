var mapManager  = {
    map: null,
    positions: [],
    heatmap: null,
    heatmapIsVisible: false,
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
        this.positions = new google.maps.MVCArray(this.positions);
        this.map = new google.maps.Map(document.getElementById('map'), this.defaultMapOptions);
        this.infoWindow = new google.maps.InfoWindow({content: ''});
        this.heatmap = new google.maps.visualization.HeatmapLayer({ data: this.positions, radius: 50});
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
        this.positions.push(new google.maps.LatLng(location.lat, location.lng));
    },
    
    // Sets the map for all markers
    setMapOnAll: function (map) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    },

    // getArray
    getArray: function () {
       this.positions = new google.maps.MVCArray([]);
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
//        this.positions = new google.maps.MVCArray([]);
    },
   
    // Get a new array
    getArray: function () {
         this.positions = new google.maps.MVCArray([]);
         console.log(this.positions.length);
    }

    // Show heatmap
    showHeatmap: function () {
        this.heatmap.setMap(this.map);
        this.heatmapIsVisible = true;
    }, 

    // Hide heatmap
    hideHeatmap: function () {
        this.heatmap.setMap(null);
        this.heatmapIsVisible = false;
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
