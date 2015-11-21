var loginManager = {
    $toggleLogin: $('.toggle-login'),
    //$toggleRegister: $('#register-button'),
    $loginForm: $('.login-register-container'),
    //$loginFormOpen: $('.login-form.open'),

    init: function() {
	var self = this;
	//var temp = templates.loginForm();

	// TODO: remove, moved to main.js
	
	// this.$toggleRegister.click(function () {
        //     if (self.$toggleRegister.hasClass("clicked")) {
        //         self.$toggleRegister.removeClass("clicked");
	// 	statusManager.success("toggled register",500);
        //     } else {
        //         self.$toggleRegister.addClass("clicked");
	// 	statusManager.success("toggled register",500);
        //     }
        // });
	
    	this.$toggleLogin.click(function () {
            if (self.$loginForm.hasClass("open")) {
                self.$loginForm.removeClass("open");
            } else {
                self.$loginForm.addClass("open");
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

