// Features is a naive dark launch module for toggling features in production
// TODO: add server side handling of dark launch codes and allow their values to be editted in the admin page
features = {
    // hard code features until server is ready
    dl_codes: {
        "MARKER_CLUSTERS": true
    },
    
    init: function () {
            // TODO: populate dl_codes with features from server
    },
    
    isEnabled: function (feature) {
        return this.dl_codes[feature];
    }
}