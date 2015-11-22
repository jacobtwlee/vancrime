function getCrimeIconURL (crimeType) {
    switch (crimeType) {
        case 'Commercial Break and Enter':
            return '/static/vancrime/images/svg-icons/pin-building.svg';
        case 'Mischief Over $5000':
            return '/static/vancrime/images/svg-icons/pin-spray-over.svg';
        case 'Mischief Under $5000':
            return '/static/vancrime/images/svg-icons/pin-spray-under.svg';
        case 'Theft From Auto Under $5000':
            return '/static/vancrime/images/svg-icons/pin-theft-under.svg';
        case 'Theft From Auto Over $5000':
            return '/static/vancrime/images/svg-icons/pin-theft-over.svg';
        case 'Theft Of Auto Under $5000':
            return '/static/vancrime/images/svg-icons/pin-car-under.svg';
        case 'Theft Of Auto Over $5000':
            return '/static/vancrime/images/svg-icons/pin-car-over.svg';
        default:
            return '/static/vancrime/images/svg-icons/pin-default.svg';
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
    
    var url = "https://twitter.com/intent/tweet?" + $.param(urlParams);
    
    return templates.tweetButton({
        url: url
    });
}

function renderFavButton (location, title) {
    if (!is_authenticated) {
        return "";
    }

    title = title || "";

    return templates.favButton({
        title: title,
        lat: location.lat,
        lng: location.lng
    });
}

function renderCrimeTooltip (crime) {    
    var month = intMonthToString(crime.month);
    var address = titleCase(crime.location.address).replace("xx", "00 Block");
    
    return templates.crimeTooltip({
        crime_type: crime.crime_type,
        month: month,
        year: crime.year,
        address: address,
        tweetButton: renderTweetButton(crime),
        favButton: renderFavButton({lat: crime.location.latitude, lng: crime.location.longitude}, crime.location.address)
    });
}
