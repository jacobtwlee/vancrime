var loginManager = {
    $toggleLogin: $('.toggle-login'),
    $loginForm: $('.login-register-container'),

    init: function() {
	var self = this;

    	this.$toggleLogin.click(function () {
            if (self.$loginForm.hasClass("open")) {
                self.$loginForm.removeClass("open");
            } else {
                self.$loginForm.addClass("open");
            }
        });
    }
};

