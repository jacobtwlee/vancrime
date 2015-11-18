var templates = {
    favoriteLocation: _.template("".concat(
        "<div class='fav-location' data-lat='<%- lat %>' data-lng='<%- lng %>'>",
            "<div class='fav-name'><%- name %></div>",
            "<div class='delete-fav-button' title='delete saved location'>✕</div>",
        "</div>"
    )),
    
    crimeTooltip: _.template("".concat(
        "<div class='marker-tooltip'>",
            "<p><b>Crime:</b> <%- crime_type %></p>",
            "<p><b>Date:</b> <%- month %>, <%- year %></p>",
            "<p><b>Address:</b> <%- address  %></p>",
            "<div class='tooltip-actions'>",
                "<%= tweetButton %>",
                "<%= favButton %>",
            "</div>",
        "</div>"
    )),
    
    tweetButton: _.template("".concat(
        "<a class='tooltip-button' target='popup' onclick=\"window.open('<%- url %>','name','width=600,height=443')\" >",
            "<div class='tweet-button'>",
                "<div class='tweet-icon'></div>",
                "Tweet",
            "</div>",
        "</a>"
    )),
    
    favButton: _.template("".concat(
        "<div data-title='<%- title %>' data-lat='<%- lat %>' data-lng='<%- lng %>' class='tooltip-button fav-button'>",
            "<div class='fav-icon'></div>",
            "Save Location",
        "</div>"
    )),
}