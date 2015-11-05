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
            return "Feburary";
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

function renderCrimeTooltip (crime) {
    html = "".concat(
        "<div class='marker-tooltip'",
        "<p><b>Crime:</b> " + crime.crime_type + "</p>",
        "<p><b>Date:</b> " + intMonthToString(crime.month) + ", " + crime.year + "</p>",
        "<p><b>Address:</b> " + crime.location.address + "</p>",
        // TODO: Tweet and save location logic
        "<p>TWEET | SAVE LOCATION</p>",
        "</div>"
    );
    return html;
}