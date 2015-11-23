var mapManager  = {
    map: null,
    positions: null,
    heatmap: null,
    neighbourhoods: null,
    heatmapIsVisible: false,
    markersAreVisible: true,
    markers: [],
    infoWindow: null,
    defaultMapOptions: {
        center: {lat: 49.2524573228171, lng: -123.11897305273436},
        zoom: 13,
        streetViewControl: false,
        mapTypeControl: false
    },
    
    init: function () {
        this.initMap();
        
        // bind map click handler
        this.map.addListener('click', this.handleMapClick.bind(this));
    },
    
    // Initialize the map centred on Vancouver
    initMap: function () {
        this.positions = new google.maps.MVCArray([]);
        this.map = new google.maps.Map(document.getElementById('map'), this.defaultMapOptions);
        this.infoWindow = new google.maps.InfoWindow({content: ''});
        this.heatmap = new google.maps.visualization.HeatmapLayer({ data: this.positions, radius: 30});
        this.neighbourhoods = new google.maps.KmlLayer({url: "http://data.vancouver.ca/download/kml/cov_localareas.kml", preserveViewport: true});
        
        if (features.isEnabled("MARKER_CLUSTERS")) {
            this.markerCluster = new MarkerClusterer(this.map, [], {gridSize: 50, maxZoom: 15, zoomOnClick: true});
        }
     },
    
    // Add a marker to the map
    addMarker: function (location, title, icon, content) {
        var self = this;
        
        var marker = new google.maps.Marker({
            position: location,
            title: title,
            icon: icon
        });
        
        if (!features.isEnabled("MARKER_CLUSTERS")) {
            var map = this.markersAreVisible ? this.map : null;        
            marker.setMap(map);
        }
        
        marker.addListener('click', function() {
            self.infoWindow.setContent(content);
            self.infoWindow.open(this.map, marker);
        });
        
        this.markers.push(marker);
        this.positions.push(new google.maps.LatLng(location.lat, location.lng));
        
        if (features.isEnabled("MARKER_CLUSTERS")) {
            if (this.markersAreVisible) this.markerCluster.addMarker(marker);
        }
    },
    
    // Sets the map for all markers
    setMapOnAll: function (map) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    },
   
    // Hide all markers
    hideMarkers: function () {
        if (features.isEnabled("MARKER_CLUSTERS")) {
            this.markerCluster.clearMarkers();
        } else {
            this.setMapOnAll(null);
        }
        this.markersAreVisible = false;
    },

    // Shows all markers
    showMarkers: function () {
        if (features.isEnabled("MARKER_CLUSTERS")) {
            this.markerCluster.addMarkers(this.markers);
        } else {
            this.setMapOnAll(this.map);
        }
        this.markersAreVisible = true;
    },
    
    // Delete all markers
    deleteMarkers: function () {
        if (features.isEnabled("MARKER_CLUSTERS")) {
            this.markerCluster.clearMarkers();
        } else {
            this.setMapOnAll(null);
        }
        
        this.markers = [];
    },
   
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

    // Show neighbourhoods 
    showNeighbourhoods: function () {
      this.neighbourhoods.setMap(this.map);
    },

    // Hide neighbourhoods
    hideNeighbourhoods: function () {
      this.neighbourhoods.setMap(null);
    },

    // Clear the position array
    clearPositions: function () {
       this.positions.clear();
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
    
    // Handle map click
    handleMapClick: function (event) {
        var location = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
        };
        
        if (is_authenticated) {
            this.displayTooltip(location, renderFavButton(location));
        }
    }
};
