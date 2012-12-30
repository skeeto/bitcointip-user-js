// ==UserScript==
// @name         Extra Bitcointip Support on Reddit
// @description  Add a tipping button (/u/bitcointip) and shrinks verifications
// @version      1.2.1
// @license      Public Domain
// @include      http://*.reddit.com/*
// ==/UserScript==

/* Changelog:
 * 1.2.1
 *    More efficient validation marking
 *    Fixed status names
 *    Run on all of reddit, including user pages
 * 1.2
 *    Use the new bitcointip API to get status information
 *    https://github.com/NerdfighterSean/bitcointip/blob/master/src/api/
 * 1.1.4
 *    Don't hide verification when it has children
 *    Don't hide verification when it's the URL target
 * 1.1.3
 *    Fix case insensitivity in regex
 * 1.1.2
 *    Display tipping amount
 * 1.1.1
 *    Support the full tipping syntax
 * 1.1
 *    Hide verification posts, inlining the verification
 * 1.0
 *    Add a "tip bitcoins" button.
 *
 * Useful tests:
 *  http://www.reddit.com/r/bitcointip/comments/13iykn/b/c7dj8ia
 *  http://www.reddit.com/r/bitcointip/comments/132nhq/t/c7c7iue
 *  http://www.reddit.com/r/Bitcoin/comments/14i9e7/y/c7dc6w9
 *  http://www.reddit.com/r/Bitcoin/comments/14qysn/
 */

var baseTip = '0.01 BTC';
var tipregex = /((\+(bitcointip|bitcoin|tip|btctip|bittip|btc))|((\+((?!0)(\d{1,4})) internet(s)?)|(\+((?!0)(\d{1,4})) point(s)? to (Gryffindor|Slytherin|Ravenclaw|Hufflepuff))))/i;
var rejectTime = 60 * 60 * 1000; // milliseconds
var api = {
    gettips: 'http://bitcointip.net/api/gettips.php?callback=?',
    gettipped: 'http://bitcointip.net/api/gettipped.php?callback=?'
};
var icons = {
    verified: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAMAAABFNRROAAAAt1BMVEX///8AAAAAyAAAuwAAwQcAvAcAvwAAwQYAyAUAxAUAxwQAwgQAvAMAxQYAvwYAxQYAxwU5yT060j460j871T89wUE9wkFGokdGu0hIzExJl09JmE9JxExJxE1K1U9K1k5Ll09LmVNMmVNM2FBNmlRRx1NSzlRTqlVUslZU1ldVq1hVrFdV2FhWrFhX21pZqlphrWJh3WRotGtrqm1stW91sXd2t3h5t3urz6zA2sHA28HG3sf4+PhvgZhQAAAAEXRSTlMAARweJSYoLTM0O0dMU1dYbkVIv+oAAACKSURBVHjaVc7XEoIwEIXhFRED1tBUxBaPFSyxK3n/5zIBb/yv9pudnVky2Ywxm345MHkVXByllPm4W24qrLbzdo1sLPPRepc+XlnSIAuz9DQYPtXnkLhUF/ysrndV3CYLRpbg2VtpxFMwfRfEl8IghEPUhB9t9lEQoke6FnzONfpU5kEIoKOn/z+/pREPWTic38sAAAAASUVORK5CYII=",
    rejected: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAMAAABFNRROAAAAQlBMVEX///+qAAAAAAC/AADIABSaTU3YMDDcPj7cSEjeUFDiZGTld3fmfHzoiorqkJDqlpbupKTuqqr99fX99/f+/Pz////kWqLlAAAABXRSTlMAAwcIM6KYVMQAAABfSURBVHjaXc7JDsAgCEVRsYpIBzro//9qHyHpond3AgkklIuXPKJcqleIIEB6FwEhQEW0t4rlUtt+22ZTMQ09NqZyiK8BtBCvc9iDWegY526hBVRmdcQ9RgD9f/G+P1+JEwRF2vKhRgAAAABJRU5ErkJggg==",
    tipped: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAANCAMAAACq939wAAAA/FBMVEWqVQCqcQCZZgCLXQCdYgDMjACOXACOXwCacQCfcQCqegCwggChggCnfwCwggCthACtgQC9iACleQC+iwDMlgDJlACmfgDDiwDBjADHlQDJnQDFlQDKmAChfRGjgBOmfhKmghKnghOqhBKthxOviROvjB+vjCGvjCOwiRSwihixixWxjSGziBOzkSmzky+0kSa0kiy3jxW8kxS8mCi8n0i8oEq9lBe9mSvOoBbUrTTUrTjbukXcsTDctDrdtj/exHbexXDfwWXfwmvjrBnksRjksx7lrhnqx17qyWTqymrq377rz3nr2qftuiHtvSv67cD67sj+997/+OX///8rcy1sAAAAHXRSTlMDCQoLDRQkKystMDc5Oj0+QUlKS0tMTVFSV15/i6wTI/gAAACWSURBVHjaHcrnAoFQGADQryI7sjNKN0RKZJVNQ8io938YN+f3ASDp1B9NAhD15UzXNH26KhNQXZyDBxZcNlloKadvFIbR56owUOFV9425ai8PrGwZaITQeisXoKHs7k/MP44ZaHYl54U5El8EdmjNEWbEjesf/Ljd9v0S1ETBtD3PNgUxB8nOQIybOGknAKgMy2FsmoIflIEZdK7PshkAAAAASUVORK5CYII="
};

/* Add the "tip bitcoins" button after "give gold". */
var $ = unsafeWindow.$, reddit = unsafeWindow;
var tip = $('<a>tip bitcoins</a>').attr({
    'class': 'tip-bitcoins login-required',
    'href': '#'
});
if (/^\/r\//.test(document.location.pathname)) {
    $('a.give-gold').parent().after($('<li></li>').append(tip));
}

/* Tipping button functionality. */
$('.tip-bitcoins').bind('click', function(event) {
    reddit.reply(event.target);
    var form = reddit.comment_reply_for_elem(event.target);
    var textarea = form.find('textarea');
    if (!textarea.val().match(tipregex)) {
        var insert = '+tip ' + baseTip;
        if (textarea.val().length > 0) {
            insert = '\n\n' + insert;
        } else {
            insert = insert + '\n\n';
        }
        textarea.val(textarea.val() + insert);
    }
    return false;
});

/* Reddit jQuery plugin. */
(function($) {
    /** Get the comment div for each element in the current set. */
    $.fn.comment = function() {
        return this.closest('.comment');
    };

    /** Get the comment ID for the first selected comment. */
    $.fn.commentID = function() {
        var full = this.first().find('input[name="thing_id"]').first().val();
        return full.replace(/^t1_/, '');
    };

    /** Get the comment's post time for the first selected comment. */
    $.fn.commentDate = function() {
        return new Date(this.find('.tagline time').first().attr('datetime'));
    };

    /** Get the comment body for the first comment in the current set. */
    $.fn.commentBody = function() {
        return this.find('.md').first();
    };

    /** Get the children comments for each comment in the current set. */
    $.fn.commentChildren = function() {
        return this.find('.comment');
    };

    /** Get the parent comment for each comment in the current set. */
    $.fn.commentParent = function() {
        return this.parent().comment();
    };

    /** Determine whether the first element is the target comment. */
    $.fn.isTarget = function() {
        return this.first().find('form').first().hasClass('border');
    };

    /** Return true if the first comment in the current set has a tip. */
    $.fn.hasTip = function() {
        return this.commentBody().children().is(function() {
            return tipregex.test($(this).text());
        });
    };
})($);

/* Hide verification replies. Note: t2_7vw3n is /u/bitcointip. */
$('a.id-t2_7vw3n').comment().each(function() {
    var $this = $(this);
    if ($this.commentChildren().length === 0 && !$this.isTarget()) {
        reddit.hidecomment($this.find('.expand').first());
    }
});

/* Find all the tip comments. */
var tips = {};
$('div.comment').each(function() {
    var $this = $(this);
    if ($this.hasTip()) {
        tips[$this.commentID()] = $this;
    }
});

/* Get status info and update the tip's comment body. */
if (Object.keys(tips).length > 0) {
    var iconStyle = 'vertical-align: middle; margin-left: 8px;';
    var display = {
        "pending": icons.verified,
        "completed": icons.verified,
        "reversed": icons.verified,
        "cancelled": icons.rejected
    };
    $.getJSON(api.gettips + '&tips=' + Object.keys(tips), function(response) {
        response.forEach(function (tip) {
            var id = tip.fullname.replace(/^t._/, '');
            var tagline = tips[id].find('.tagline').first();
            var icon = $('<a/>').attr({href: tip.tx, target: '_blank'});
            tagline.append(icon.append($('<img/>').attr({
                src: display[tip.status],
                style: iconStyle,
                title: '+$' + tip.amountUSD + ' -> ' + tip.receiver
            })));
            delete tips[id];
        });

        /* Deal with unanswered tips. */
        for (var id in tips) {
            if (Date.now() - tips[id].commentDate() > rejectTime) {
                var tagline = tips[id].find('.tagline').first();
                tagline.append($('<img/>').attr({
                    src: icons.rejected,
                    style: iconStyle,
                    title: 'This tip is invalid.'
                }));
            }
        }
    });
}
