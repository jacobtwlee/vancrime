var loginManager = {
    $toggleLogin: $('.login-button'),
    $loginHeader: $('.login-header'),
    
    init: function() {
	var self = this;
	var temp = templates.loginForm();

	this.$toggleLogin.click(function () {
            if (self.$loginHeader.hasClass("open")) {
                self.$loginHeader.removeClass("open");
		self.$toggleLogin.text("Login/Register");
            } else {
                self.$loginHeader.addClass("open");
		self.$toggleLogin.text("Cancel");
		self.doreq();
            }
        });

    },
    doreq: function() {
	var name = "johnd";
	var password = "johnpassword";

	$.ajax({
            url: "/login/",
            method: "POST",
            headers: {
		"X-CSRFToken": getCookie('csrftoken')
            },
            data: {
		username: name,
		password: password,
            },
            success: function (response) {
		if (response.success) {
                    statusManager.success("Ajax login succeeded!", 1500)
		    location.href = "/"
		} else {
                    statusManager.error(response.message || "Error logging in", 2000)
		}
            },
            error: function (response) {
		statusManager.error(response.message || "Error adding favorite", 2000)
            }
	});
    }
};

