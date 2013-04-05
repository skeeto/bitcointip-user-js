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
    },
    isMatchURL: function() {
        return true;
    },
    addCSS: function(css) {
        $(document.body).append($('<style/>').text(css));
    },
    /*
    Iterate through an array in chunks, executing a callback on each element.
    Each chunk is handled asynchronously from the others with a delay betwen each batch.
    If the provided callback returns false iteration will be halted.
    */
    forEachChunked: function(array, chunkSize, delay, call) {
        if (array == null) return;
        if (chunkSize == null || chunkSize < 1) return;
        if (delay == null || delay < 0) return;
        if (call == null) return;
        var counter = 0;
        var length = array.length;
        function doChunk() {
            for (var end = Math.min(array.length, counter+chunkSize); counter < end; counter++) {
                var ret = call(array[counter], counter, array);
                if (ret === false) return;
            }
            if (counter < array.length) {
                window.setTimeout(doChunk, delay);
            }
        }
        window.setTimeout(doChunk, delay);
    },
    notification: function(msg) {
        alert(msg);
    },
    watchForElement: function() { /* stub */ },
    setCursorPosition: function(form, pos) {
        elem = $(form)[0];
        if (!elem) return;

        if (elem.setSelectionRange) {
            elem.setSelectionRange(pos, pos);
        } else if (elem.createTextRange) {
            var range = elem.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    
        return form;
    }
};

var RESConsole = {
    getModulePrefs: function () {
        return true;
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
