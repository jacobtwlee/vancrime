$(document).ready(function () {
    mapManager.initMap();

    $.ajax({
        method: "GET",
        url: "/api/crimes",
        beforeSend: showLoadingOverlay,
        success: addMapMarkers,
    });
});

var $loadingOverlay = $('#loading-overlay');

function showLoadingOverlay () {
    $loadingOverlay.show();
}

function hideLoadingOverlay () {
    $loadingOverlay.hide();
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