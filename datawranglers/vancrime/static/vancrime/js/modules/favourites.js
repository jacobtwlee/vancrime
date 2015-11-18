var favoritesManager = {
        $map: $('#map'),
        $favsList: $('.favs-list'),
        $toggleFavs: $('.toggle-favs'),
    
        init: function () {
            var self = this;
            
            // delegate click events for adding and deleting favorite locations
            this.$map.delegate(".fav-button", "click", this.addfavoriteLocation.bind(this)); 
            this.$favsList.delegate(".delete-fav-button", "click", this.deletefavoriteLocation.bind(this));
            
            // bind handler for clicking a favorite location
            this.$favsList.delegate(".fav-location", "click", this.openfavoriteLocation.bind(this));
            
            // bind handler for opening/closing favorite loations list
            this.$toggleFavs.click(function () {
                if (self.$favsList.hasClass("open")) {
                    self.$favsList.removeClass("open");
                } else {
                    self.$favsList.addClass("open");
                }
            });
            
            // populate favorite locations list with favorite locations (if the user is logged in)
            if (is_authenticated) {
                this.fetchFavoriteLocations();
            }
        },
        
        fetchFavoriteLocations: function () {
            var self = this;
            $.ajax({
                url: '/api/favorites',
                method: 'GET',
                success: function (response) {
                    var favorites = response.results;
                    
                    favorites.forEach(function (favorite) {
                        self.renderFavoriteLocation(favorite.name, favorite.latitude, favorite.longitude);
                    });
                },
                error: function (response) {
                    statusManager.error("Error retrieving favorite locations");
                }
            });
        },
    
        addfavoriteLocation: function (event) {
            var self = this;
            var $el = $(event.currentTarget);
            
            var title = $el.attr('data-title');
            var latitude = parseFloat($el.attr('data-lat'));
            var longitude = parseFloat($el.attr('data-lng'));
            
            var name = "";
            
            // prompt for location name until a valid name is submitted
            while (name.length === 0) {
                name = prompt("Enter a name for this location:", title);
                if (name === null) return;
            }
            
            $.ajax({
                url: "/api/favorites/",
                method: "POST",
                headers: {
                    "X-CSRFToken": getCookie('csrftoken')
                },
                data: {
                    name: name,
                    latitude: latitude,
                    longitude: longitude,
                },
                success: function (response) {
                    if (response.success) {
                        self.renderFavoriteLocation(name, latitude, longitude);
                        statusManager.success("Location saved to favorites", 1500)
                    } else {
                        statusManager.error(response.message || "Error adding favorite", 2000)
                    }
                },
                error: function (response) {
                    statusManager.error(response.message || "Error adding favorite", 2000)
                }
            });
        },
        
        deletefavoriteLocation: function (event) {
            event.stopPropagation();
            var $el = $(event.currentTarget).parent();
            
            var name = $el.find('.fav-name').text();

            $.ajax({
                url: "/api/favorites/" + name,
                method: "DELETE",
                headers: {
                    "X-CSRFToken": getCookie('csrftoken')
                },
                success: function (response) {
                    if (response.success) {
                        $el.remove();
                        statusManager.success("Favorite deleted", 1500)
                    } else {
                        statusManager.error(response.message || "Error deleting favorite", 2000)
                    }
                },
                error: function (response) {
                    statusManager.error(response.message || "Error deleting favorite", 2000)
                }
            });
        },
        
        openfavoriteLocation: function (event) {
            var $el = $(event.currentTarget);
            
            var location = {
                lat: parseFloat($el.attr("data-lat")),
                lng: parseFloat($el.attr("data-lng"))
            };
            
            mapManager.setLocationAndZoom(location, 18);
        },
        
        renderFavoriteLocation: function (name, latitude, longitude) {
            var template = templates.favoriteLocation({
                name: name,
                lat: latitude,
                lng: longitude
            });
            
            this.$favsList.append(template);
        }
};