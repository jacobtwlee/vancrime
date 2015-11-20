var loginManager = {
    $toggleLogin: $('.login-button'),
    $loginHeader: $('.login-header'),

    init: function() {
	statusManager.error("Initialized login manager!");
	var self = this;

	this.$toggleLogin.click(function () {
            if (self.$loginHeader.hasClass("open")) {
                self.$loginHeader.removeClass("open");
            } else {
                self.$loginHeader.addClass("open");
            }
        });
    }
};
