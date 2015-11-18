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
        },
    
        addfavoriteLocation: function (event) {
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
            
            var template = templates.favoriteLocation({
                name: name,
                lat: latitude,
                lng: longitude
            });
            
            this.$favsList.append(template);
               
            /*
            $.ajax({
                url: "add-fav", // TODO
                method: "POST",
                data: {
                    name: name,
                    lat: latitude,
                    lng: longitude
                },
                success: function () {
                    // TODO: 
                        // if success: append new fav to fav list and display success status
                        // else: display error status
                },
                error: function () {
                    // TODO: display error status
                }
            });
            */
        },
        
        deletefavoriteLocation: function (event) {
            event.stopPropagation();
            var $el = $(event.currentTarget).parent();

            $el.remove();
            /*
            $.ajax({
                url: "delete-fav", // TODO
                method: "DELETE",
                data: {
                    name: name,
                },
                success: function () {
                    // TODO: 
                        // if success: remove fav from fav list and display success status
                        // else: display error status
                },
                error: function () {
                    // TODO: display error status
                }
            });
            */
        },
        
        openfavoriteLocation: function (event) {
            var $el = $(event.currentTarget);
            
            var location = {
                lat: parseFloat($el.attr("data-lat")),
                lng: parseFloat($el.attr("data-lng"))
            };
            
            mapManager.setLocationAndZoom(location, 18);
        }
};