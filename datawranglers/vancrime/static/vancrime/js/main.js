$(document).ready(function () {
    mapManager.initMap();
    
    $('#filter-crime-type').val("all")
    $('#filter-crime-year').val(default_year)
    $('#filter-crime-month').val(default_month)
    
    updateResults();
    
    if (default_latitude && default_longitude) {
        var location = {
            lat: parseFloat(default_latitude),
            lng: parseFloat(default_longitude)
        }
        
        mapManager.setLocationAndZoom(location, 18);
    }
    
    $('#map').delegate(".fav-button", "click", addFavLocation);    
    mapManager.onMapClick(handleMapClick);
    $('#filter-button').click(updateResults);
    $('#graph-button').click(showSummaryGraph);
    $('.graph-bg').click(hideSummaryGraph);
    
    $('.toggle-favs').click(function () {
        if ($('.favs-list').hasClass("open")) {
            $('.favs-list').removeClass("open");
        } else {
            $('.favs-list').addClass("open");
        }
    });
    
    $('#toggle-markers').click(function () {
        var $this = $(this);
        
        if ($this.hasClass("off")) {
            mapManager.showMarkers();
            $this.removeClass("off");
            $this.text("Hide Markers");
        } else {
            mapManager.hideMarkers();
            $this.addClass("off");
            $this.text("Show Markers");
        }
    });
});

var $loadingOverlay = $('#loading-overlay');

function showLoadingOverlay () {
    $loadingOverlay.fadeIn(300);
}

function hideLoadingOverlay () {
    $loadingOverlay.fadeOut(300);
}

function handleMapClick (event) {
    var location = event.latLng;
    mapManager.displayTooltip(location, renderFavButton(location));
}

function handleError (message) {
    statusManager.error(message);
    hideLoadingOverlay();
}

function addMapMarkers (response) {
    var crimes = response.results;
    
    mapManager.deleteMarkers();
    
    if (crimes.length === 0) {
        statusManager.info("No crimes found");
    }
    
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

function updateResults () {
    updateSummaryTable();
    
    var crime_type = $('#filter-crime-type').find(":selected").val();
    var year = $('#filter-crime-year').find(":selected").val();
    var month = $('#filter-crime-month').find(":selected").val();
    
    var queryParams = {};
    
    if (crime_type != "all") {
        queryParams.crime_type = crime_type;
    }
    
    if (year != "all") {
        queryParams.year = year;
    }
    
    if (month != "all") {
        queryParams.month = month;
    }
    
    var url = "/api/crimes?" + $.param(queryParams);
        
    $.ajax({
        url: url,
        method: "GET",
        beforeSend: showLoadingOverlay,
        success: addMapMarkers,
        error: function () {
            handleError("Error obtaining crime data");
        }
    });
}

function showSummaryGraph () {
    showLoadingOverlay();
    var year = $('#filter-crime-year').find(":selected").val();
    var month = $('#filter-crime-month').find(":selected").val();
    var crimeType = $('#filter-crime-type').find(":selected").val();
    var monthRange = $('#summary-month-range').find(":selected").val();
    
    if (month == "all") {
        month = 1;
    }
    
    var url = "/summary/graph/" + year + "/" + month;
    
    $.ajax({
        url: url,
        method: "GET",
        data: {
            "monthRange": monthRange,
            "crimeType": crimeType
        },
        success: function (response) {
            $('#graph-overlay').find('.graph-content').html(response);
            $('#graph-overlay').fadeIn(300);
            hideLoadingOverlay();
        },
        error: function () {
            handleError("Error generating summary graph")
        }
    });
}

function hideSummaryGraph () {
    $('#graph-overlay').fadeOut(300);
}

function updateSummaryTable () {
    var year = $('#filter-crime-year').find(":selected").val();
    var month = $('#filter-crime-month').find(":selected").val();
    
    if (month == "all") {
        month = "";
    }
    
    var url = "/summary/" + year + "/" + month;
    
    $.ajax({
        url: url,
        method: "GET",
        success: function (response) {
            $('#summary-table').html(response);
        },
        error: function () {
            handleError("Error generating summary table")
        }
    });
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