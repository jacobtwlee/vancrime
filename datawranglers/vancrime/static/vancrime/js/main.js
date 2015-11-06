$(document).ready(function () {
    mapManager.initMap();

    $.ajax({
        method: "GET",
        url: "/api/crimes",
        beforeSend: showLoadingOverlay,
        success: addMapMarkers,
    });
    
    $('#map').delegate(".fav-button", "click", addFavLocation);    
    mapManager.onMapClick(handleMapClick);
});

var $loadingOverlay = $('#loading-overlay');

function showLoadingOverlay () {
    $loadingOverlay.show();
}

function hideLoadingOverlay () {
    $loadingOverlay.hide();
}

function handleMapClick (event) {
    var location = event.latLng;
    mapManager.displayTooltip(location, renderFavButton(location));
}

function addMapMarkers (response) {
    var crimes = response.results;
    
    crimes.forEach(function(crime) {
        // Don't add this crime if it's location hasn't been geocoded yet
        if (crime.location.latitude == null || crime.location.latitude == null) {
            return;
        }
        
        var location = {"lat": parseFloat(crime.location.latitude), "lng": parseFloat(crime.location.longitude)};
        var address = crime.location.address;
        var title = crime.crime_type;
        var icon = getCrimeIconURL(crime.crime_type);
        var tooltipContent = renderCrimeTooltip(crime);
        
        mapManager.addMarker(location, title, icon, tooltipContent);
    });
    
    hideLoadingOverlay();
}

function addFavLocation () {
    var title = $(this).attr('data-title');
    var latitude = parseFloat($(this).attr('data-lat'));
    var latitude = parseFloat($(this).attr('data-lng'));
    
    var name = "";
    
    while (name.length === 0) {
        name = prompt("Enter a name for this location:", title);
        if (name === null) return;
    }
    
    // TODO: sanitize name   
    // TODO: make ajax request to save location
}