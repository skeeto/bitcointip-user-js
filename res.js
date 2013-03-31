var RESUtils = {
    currentSubreddit: function() {
        var match = location.pathname.match(/\/r\/([^/]+)/);
        if (match) {
            return match[1].toLowerCase();
        } else {
            return null;
        }
    },
    loggedInUser: function() {
        var user = $('#header-bottom-right span.user a:first').text();
        return user === "login or register" ? null : user;
    }
};

var RESStorage = {
    localStorage: (window.unsafeWindow || window).localStorage,
    setItem: function(key, value) {
        this.localStorage[key] = value;
    },
    getItem: function(key) {
        var value = this.localStorage[key];
        return value != null ? value : null;
    }
};

var modules = {};
