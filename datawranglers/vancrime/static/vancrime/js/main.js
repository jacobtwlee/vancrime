$(document).ready(function () {
    mapManager.init();
    favoritesManager.init();
    loginManager.init();

    handleErrorMessages();
    
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
    
    $('#filter-button').click(updateResults);
    $('#graph-button').click(showSummaryGraph);
    $('.graph-bg').click(hideSummaryGraph);
    $('.settings-bg').click(hideSettingsPane);
    $('#settings').click(showSettingsPane);
    
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

    $('#toggle-heatmap').click(function () {
        var $this = $(this);
        
        if ($this.hasClass("off")) {
            mapManager.showHeatmap();
            $this.removeClass("off");
            $this.text("Hide Heatmap");
        } else {
            mapManager.hideHeatmap();
            $this.addClass("off");
            $this.text("Show Heatmap");
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

function handleError (message) {
    statusManager.error(message);
    hideLoadingOverlay();
}

function addMapMarkers (response) {
    var crimes = response.results;
    mapManager.clearPositions();    
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

function handleErrorMessages() {
    /* Credit for urlparams parser function:
       http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
       */
    var urlParams;
    (window.onpopstate = function () {
	var match,
	    pl     = /\+/g,  // Regex for replacing addition symbol with a space
	    search = /([^&=]+)=?([^&]*)/g,
	    decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
	    query  = window.location.search.substring(1);

	urlParams = {};
	while (match = search.exec(query))
	    urlParams[decode(match[1])] = decode(match[2]);
    })();

    var code = "";
    if ( urlParams["error"] != null ) {
	statusManager.error( expandMsg( urlParams["error"] ) );
    } else if ( urlParams["msg"] != null ) {
	statusManager.info( expandMsg( urlParams["msg"] ) );
    }

}

function expandMsg( msg ) {
    if (msg == 'baduser') {
	return 'User name already in use. Select another one and try again.';
    } else if (msg == 'regpass') {
	return 'Thanks for registering!';
    } else if (msg == 'badlogin') {
	return 'Incorrect username or password. Please try again.';
    } else if (msg == 'welcome') {
	return 'Welcome back!';
    } 	
    return "An unexpected error occurred. Please try again.";
}

function showSettingsPane() {
    $('#settings-overlay').fadeIn(700);    
}

function hideSettingsPane() {
    $('#settings-overlay').fadeOut(700);
}

function checkPassword() {
    var password = $('.register-form input[name=password]').val(),
        retypedPassword = $('.register-form input[name=password2]').val();
        
    if (password === retypedPassword) {
        return true;
    } else {
        statusManager.warning("Passwords do not match", 3000);
        return false;
    }

}
