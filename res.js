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
        alert(msg.message);
    },
    commentsRegex: /https?:\/\/([a-z]+).reddit.com\/[-\w\.\/]*comments\/[-\w\.\/]*/i,
    friendsCommentsRegex: /https?:\/\/([a-z]+).reddit.com\/r\/friends\/*comments\/?/i,
    inboxRegex: /https?:\/\/([a-z]+).reddit.com\/message\/[-\w\.\/]*/i,
    profileRegex: /https?:\/\/([a-z]+).reddit.com\/user\/[-\w\.#=]*\/?(comments)?\/?(\?([a-z]+=[a-zA-Z0-9_%]*&?)*)?$/i, // fix to regex contributed by s_quark
    submitRegex: /https?:\/\/([a-z]+).reddit.com\/([-\w\.\/]*\/)?submit\/?$/i,
    prefsRegex: /https?:\/\/([a-z]+).reddit.com\/prefs\/?/i,
    commentPermalinkRegex: /comments\/[a-z0-9]+\/[^/]+\/[a-z0-9]+$/,
    pageType: function() {
        if (typeof(this.pageTypeSaved) == 'undefined') {
            var pageType = '';
            var currURL = location.href.split('#')[0];
            if (RESUtils.profileRegex.test(currURL)) {
                pageType = 'profile';
            } else if ((RESUtils.commentsRegex.test(currURL)) || (RESUtils.friendsCommentsRegex.test(currURL))) {
                pageType = 'comments';
            } else if (RESUtils.inboxRegex.test(currURL)) {
                pageType = 'inbox';
            } else if (RESUtils.submitRegex.test(currURL)) {
                pageType = 'submit';
            } else if (RESUtils.prefsRegex.test(currURL)) {
                pageType = 'prefs';
            } else {
                pageType = 'linklist';
            }
            this.pageTypeSaved = pageType;
        }
        return this.pageTypeSaved;
    },
    watchForElement: function() { /* stub */ },
    setCursorPosition: function(form, pos) {
        var elem = $(form)[0];
        if (!elem) return null;

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
    },
    isCommentPermalinkPage: function() {
        var path = document.location.pathname;
        return RESUtils.commentPermalinkRegex.test(path);
    },
    click: function(obj, button) {
        var evt = document.createEvent('MouseEvents');
        button = button || 0;
        evt.initMouseEvent('click', true, true, window.wrappedJSObject, 0, 1, 1, 1, 1, false, false, false, false, button, null);
        obj.dispatchEvent(evt);
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
