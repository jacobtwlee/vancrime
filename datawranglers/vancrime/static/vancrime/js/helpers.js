function getCrimeIconURL (crimeType) {
    switch (crimeType) {
        case 'Commercial Break and Enter':
            return '/static/vancrime/images/gmaps-icons/red-dot.png';
        case 'Mischief Over $5000':
        case 'Mischief Under $5000':
            return '/static/vancrime/images/gmaps-icons/blue-dot.png';
        case 'Theft From Auto Under $5000':
        case 'Theft From Auto Over  $5000':
        case 'Theft Of Auto Under $5000':
        case 'Theft Of Auto Over $5000':
            return '/static/vancrime/images/gmaps-icons/green-dot.png';
        default:
            return '/static/vancrime/images/gmaps-icons/red-dot.png';
    }
}

function intMonthToString (monthInt) {
    switch (monthInt) {
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7:
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
        default:
            return "";
    }
}

function titleCase (str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function capitalizeFirstLetter (str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function renderTweetButton (crime) {
    var urlParams = {
        text: "VANCRIME ALERT! " + capitalizeFirstLetter(crime.crime_type.toLowerCase()) + " @ " + titleCase(crime.location.address).replace(/(\d)+xx\s/, "") + " in " + intMonthToString(crime.month) + ", " + crime.year,
        url: "http://vancrime.me/?lat=" + crime.location.latitude + "&lng=" + crime.location.longitude + "&month=" + crime.month + "&year=" + crime.year,
        hashtags: "VanCrime"
    }
    
    var href = "https://twitter.com/intent/tweet?" + $.param(urlParams);
    
    html = "".concat(
        "<a class='tooltip-button' target='popup' onclick=\"window.open('" + href + "','name','width=600,height=443')\" >",
        "<div class='tweet-button'><div class='tweet-icon'></div>Tweet</div>",
        "</a>"
    );
    
    return html;
}

function renderFavButton (location, title) {
    // TODO: should only show fav button if user is logged in
    title = title || "";
    var dataFields = "data-title='" + title + "'" +  "' data-lat='" + location.latitude + "' data-lng='" + location.longitude + "'";
    return "<div " + dataFields + " class='tooltip-button fav-button'><div class='fav-icon'></div>Save Location</div>";
}

function renderCrimeTooltip (crime) {
    html = "".concat(
        "<div class='marker-tooltip'>",
        "<p><b>Crime:</b> " + crime.crime_type + "</p>",
        "<p><b>Date:</b> " + intMonthToString(crime.month) + ", " + crime.year + "</p>",
        "<p><b>Address:</b> " + titleCase(crime.location.address).replace("xx", "00 Block") + "</p>",
        "<div class='tooltip-actions'>",
        renderTweetButton(crime),
        renderFavButton(crime.location, crime.location.address),
        "</div>",
        "</div>"
    );
    return html;
}