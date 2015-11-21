var loginManager = {
    $toggleLogin: $('.login-button'),
    $toggleRegister: $('.register-button'),
    $loginForm: $('.login-form'),
    $loginFormOpen: $('.login-form.open'),

    init: function() {
	var self = this;
	var temp = templates.loginForm();

	this.$toggleRegister.click(function () {
            if (self.$toggleRegister.hasClass("clicked")) {
                self.$toggleRegister.removeClass("clicked");
		statusManager.success("toggled register",500);
            } else {
                self.$toggleRegister.addClass("clicked");
		statusManager.success("toggled register",500);
            }
        });
	
    	this.$toggleLogin.click(function () {
            if (self.$loginForm.hasClass("open")) {
                self.$loginForm.removeClass("open");
		self.$toggleLogin.text("Login");
            } else {
                self.$loginForm.addClass("open");
		self.$toggleLogin.text("Cancel");
            }
        });

    }
    // doreq: function() {
    // 	// TODO: get name and password from the form element
    // 	// Q: is it hashed? security?
    // 	var name = "john";
    // 	var password = "johnpassword";

    // 	$.ajax({
    //         url: "/login/",
    //         method: "POST",
    //         headers: {
    // 		"X-CSRFToken": getCookie('csrftoken')
    //         },
    //         data: {
    // 		username: name,
    // 		password: password,
    //         },
    //         success: function (response) {
    // 		if (response.success) {
    //                 statusManager.success("Ajax login succeeded!", 1500)
    // 		    location.href = "/"
    // 		} else {
    //                 statusManager.error(response.message || "Error logging in", 2000)
    // 		}
    //         },
    //         error: function (response) {
    // 		statusManager.error(response.message || "Error adding favorite", 2000)
    //         }
    // 	});
    // }
};

