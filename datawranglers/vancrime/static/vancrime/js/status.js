statusManager = {
    $statusBar: $('#status-bar'),
    defaultDuration: 5000,
    statusColours: {
        info: "#6990CC",
        success: "#8EBD45",
        warning: "#E2BE35",
        error: "#E23535"
    },
    
    info: function (message, duration) {
        this.displayStatusMessage(message, this.statusColours.info, duration);
    },
    
    success: function (message, duration) {
        this.displayStatusMessage(message, this.statusColours.success, duration);
    },
    
    warning: function (message, duration) {
        this.displayStatusMessage(message, this.statusColours.warning, duration);
    },
    
    error: function (message, duration) {
        this.displayStatusMessage(message, this.statusColours.error, duration);
    },
    
    displayStatusMessage: function (message, color, duration) {
        var self = this;
        
        clearTimeout(this.currentTimeout);
        duration = duration || this.defaultDuration;
        
        this.$statusBar.css("background-color", color);
        this.$statusBar.text(message);
        this.$statusBar.fadeIn(300);
        
        this.currentTimeout = setTimeout(function () {
            self.$statusBar.fadeOut(300);
        }, duration);
    }
}