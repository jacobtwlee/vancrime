var loginManager = {
    $toggleLogin: $('.login-button'),
    $loginHeader: $('.login-header'),

    init: function() {
	statusManager.error("Initialized login manager!");
	var self = this;
	var temp = templates.loginForm();

	this.$toggleLogin.click(function () {
            if (self.$loginHeader.hasClass("open")) {
                self.$loginHeader.removeClass("open");
		self.$toggleLogin.text("Login/Register");
            } else {
                self.$loginHeader.addClass("open");
		self.$toggleLogin.text("Cancel");
		self.$loginHeader.append(temp);
            }
        });
    }
};
