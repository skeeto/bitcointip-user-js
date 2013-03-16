// ==UserScript==
// @name         Extra Bitcointip Support on Reddit
// @description  Add a tipping button (/u/bitcointip) and shrinks verifications
// @version      1.4.5
// @license      Public Domain
// @include      http*://*.reddit.com/*
// @exclude      http*://*.reddit.com/user/bitcointip
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript==

/* Changelog:
 * 1.4.5
 *    Fix currency display precision
 * 1.4.4
 *    Fix cancelled icon bug
 *    Update to latest tip regexp
 * 1.4.3
 *    Fix subreddit case-sensitivity bug
 *    Adjusted "pending" icon color
 * 1.4.2
 *    Bug fixes with balances
 * 1.4.0
 *    Subreddit support indicator
 *    Current balance display
 *    New icons for richer status indicators
 *    Support for reddit https (https everywhere).
 * 1.3.5
 *    Drop JSONP for CORS to increase safety.
 *    Attempt to link to source tip from tipped icons.
 * 1.3.4
 *    Inject the bot status into r/bitcointip's sidebar
 * 1.3.3
 *    Fix API URL.
 *    Finer tip rejection control
 *    Small bug fixes
 * 1.3.1
 *    A tip button on posts
 *    Verification icons on posts
 *    Small display tweaks
 * 1.3.0
 *    New verification and rejection markings
 *    Use the new gettipped API
 *    All new jQuery reddit plugin
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
 */

var baseTip = '0.01 BTC';
var tipregex = /((\+(bitcointip|bitcoin|tip|btctip|bittip|btc)( ((@?1[A-Za-z0-9]{25,35})|((@)?([A-Za-z0-9_-]{3,20}))))?( ((((\$)|&#36;|฿|&#3647;|&bitcoin;|¥|&#165;|&yen;|£|&#163;|&pound;|€|&#8364;|&euro;)? ?((\d|\,){0,10}(\d\.?|\.(\d|\,){0,10}))( ?(BTC|XBC|bitcoin|mBTC|CBC|MBC|millibitcoin|millibit|cBTC|bitcent|centibit|centibitcoin|USD|dollar|american|AUD|australian|CAD|canadian|GBP|pound|EUR|euro|JPY|yen)(s)?)?)|ALL|FLIP))( (NOVERIFY|VERIFY))?)|((\+((?!0)(\d{1,4})) internet(s)?)|(\+((?!0)(\d{1,4})) point(s)? to (Gryffindor|Slytherin|Ravenclaw|Hufflepuff))))/i;
var botDownThreshold = 15 * 60 * 1000; // milliseconds
var botStatusHtml = {
    up: '<span class="status-up">UP</span>',
    down: '<span class="status-down">DOWN</span>'
};
var api = {
    gettips: 'http://bitcointip.net/api/gettips.php?',
    gettipped: 'http://bitcointip.net/api/gettipped.php?',
    subreddits: 'http://bitcointip.net/api/subreddits.php',
    balance: 'http://bitcointip.net/api/balance.php'
};
var icons = {
    completed: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAMAAABFNRROAAAAt1BMVEX///8AAAAAyAAAuwAAwQcAvAcAvwAAwQYAyAUAxAUAxwQAwgQAvAMAxQYAvwYAxQYAxwU5yT060j460j871T89wUE9wkFGokdGu0hIzExJl09JmE9JxExJxE1K1U9K1k5Ll09LmVNMmVNM2FBNmlRRx1NSzlRTqlVUslZU1ldVq1hVrFdV2FhWrFhX21pZqlphrWJh3WRotGtrqm1stW91sXd2t3h5t3urz6zA2sHA28HG3sf4+PhvgZhQAAAAEXRSTlMAARweJSYoLTM0O0dMU1dYbkVIv+oAAACKSURBVHjaVc7XEoIwEIXhFRED1tBUxBaPFSyxK3n/5zIBb/yv9pudnVky2Ywxm345MHkVXByllPm4W24qrLbzdo1sLPPRepc+XlnSIAuz9DQYPtXnkLhUF/ysrndV3CYLRpbg2VtpxFMwfRfEl8IghEPUhB9t9lEQoke6FnzONfpU5kEIoKOn/z+/pREPWTic38sAAAAASUVORK5CYII=",
    cancelled: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAMAAABFNRROAAAAQlBMVEX///+qAAAAAAC/AADIABSaTU3YMDDcPj7cSEjeUFDiZGTld3fmfHzoiorqkJDqlpbupKTuqqr99fX99/f+/Pz////kWqLlAAAABXRSTlMAAwcIM6KYVMQAAABfSURBVHjaXc7JDsAgCEVRsYpIBzro//9qHyHpond3AgkklIuXPKJcqleIIEB6FwEhQEW0t4rlUtt+22ZTMQ09NqZyiK8BtBCvc9iDWegY526hBVRmdcQ9RgD9f/G+P1+JEwRF2vKhRgAAAABJRU5ErkJggg==",
    tipped: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAANCAMAAACq939wAAAA/FBMVEWqVQCqcQCZZgCLXQCdYgDMjACOXACOXwCacQCfcQCqegCwggChggCnfwCwggCthACtgQC9iACleQC+iwDMlgDJlACmfgDDiwDBjADHlQDJnQDFlQDKmAChfRGjgBOmfhKmghKnghOqhBKthxOviROvjB+vjCGvjCOwiRSwihixixWxjSGziBOzkSmzky+0kSa0kiy3jxW8kxS8mCi8n0i8oEq9lBe9mSvOoBbUrTTUrTjbukXcsTDctDrdtj/exHbexXDfwWXfwmvjrBnksRjksx7lrhnqx17qyWTqymrq377rz3nr2qftuiHtvSv67cD67sj+997/+OX///8rcy1sAAAAHXRSTlMDCQoLDRQkKystMDc5Oj0+QUlKS0tMTVFSV15/i6wTI/gAAACWSURBVHjaHcrnAoFQGADQryI7sjNKN0RKZJVNQ8io938YN+f3ASDp1B9NAhD15UzXNH26KhNQXZyDBxZcNlloKadvFIbR56owUOFV9425ai8PrGwZaITQeisXoKHs7k/MP44ZaHYl54U5El8EdmjNEWbEjesf/Ljd9v0S1ETBtD3PNgUxB8nOQIybOGknAKgMy2FsmoIflIEZdK7PshkAAAAASUVORK5CYII=",
    pending: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAABWUlEQVR4nI2Sy0sCURTGD6S2jjYFrdy0DNpEhokb8zFm5YyaO6NFYNGqF/0hPZYtR79FUbgw0BFtDKIgUCSpv8Od3XtGJzWDBj64h/l+954XdbtdGhQZkzNUd7ptifiXZygo0Wz0WsWoyHTMj4Wo6nRLQ7KdRuZz15bWSiF0GQOVXJ4hqP/COGDTjEO9SyByIcDHiUXiT+QsAaW1wabgi4KtVxVqM4lQVcFx4RS5tzy0vIgZFDVTnaYkFG6us2lbTyNws4ZAMYizwjk6nQ7KbQOJfMqCRBlERZpWruJYfvYigx02ZfUDHN2e8Pnpy8T+w6G4MIqI8HFH5Ut9SKZQ/jDYPAh4K36EGzGrkwz1avK8+/jn3n2WzaPASsNnQaJpvYG65ixwFV7Dj7iuQcul+Cwvs4Ga1fafOVUcC31Qpio1BJjO0PiNEJPn9osapeyNqLmW/lyj/+7eN1qRZT0kKLSqAAAAAElFTkSuQmCC",
    reversed: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAABOklEQVR42p2SvU4CQRSFj+9h7DQ2VmsDCy0/Cw2wsNtuRwixIiQ8CZaWGDBaaAiJyVAg2xi1AaTQ19jyOHeSIbLBxuIkM7Pn23PvnQHJPSngNAYcK9mnPWng/LpaZVoadg9CC+BSDNsg4FcU7bRpNjkslaiAYAfZhL+AuFbjQ6PBYaXCZ6AK4Mj0IMBGH4rptVjkW73Ote9zUS5z2u/zfTzmRBL1XoNniIFjgdaeZ0yjMORNocCZ1nQwYJIk3CrFSatlIGkDM+BEouNMhndRZEyjTof3vZ5Zfy+XfOp2zQ+ND3BMkoWkhE+lxLwHzPN5rjzPTtLZ9fSRzZqPj+22MaeBlesaSIZmp3dhQZXLcaQHcev7sjZnFngBwr17mgNFC+pSRRawZV0dfBFy89ogDYvEbBMav33/ens/XHaDp7U/bFsAAAAASUVORK5CYII="
};
var displayCurrency = {
    balanceUSD: {unit: '$', precision: 2},
    balanceBTC: {unit: '฿'},
    balanceJPY: {unit: '¥'},
    balanceGBP: {unit: '£', precision: 2},
    balanceEUR: {unit: '€', precision: 2}
};
var $ = unsafeWindow.$,
    S = unsafeWindow.localStorage,
    reddit = unsafeWindow;

/* Helper functions. */

function identity(x) {
    return x;
}

/* Add the "tip bitcoins" button after "give gold". */
var tip = $('<a>tip bitcoins</a>').attr({
    'class': 'tip-bitcoins login-required',
    'href': '#'
});
if (/^\/r\//.test(document.location.pathname)) {
    $('a.give-gold').parent().after($('<li/>').append(tip.clone()));
    if ($('.link').length === 1) { // Viewing a submission?
        $('.link ul.buttons').append($('<li/>').append(tip.clone()));
    }
}

/* Tipping button functionality. */
$('.tip-bitcoins').on('click', function(event) {
    var $target = $(event.target);
    var form = null;
    if ($target.closest('.link').length > 0) {
        /* Post */
        form = $('.usertext-edit').first();
    } else {
        /* Comment */
        reddit.reply(event.target);
        form = reddit.comment_reply_for_elem(event.target);
    }
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

/* Subreddit indicator. */
var subreddit = (function(match) {
    if (match) {
        return match[1];
    } else {
        return null;
    }
}(location.pathname.match(/\/r\/([^/]+)/)));
if (subreddit) {
    $.getJSON(api.subreddits, function(data) {
        if (data.subreddits.indexOf(subreddit.toLowerCase()) >= 0) {
            $('#header-bottom-right form.logout')
                .before($('<span>|</span>').attr({
                    'class': 'separator'
                }))
                .prev().before($('<img/>').attr({
                    'src': icons.tipped,
                    'style': 'vertical-align: text-bottom;',
                    'title': 'Tips enabled in this subreddit.'
                }));
        }
    });
}

/* Balance indicator. */
var user = $('#header-bottom-right span.user a').first().text();
if (user === "login or register") {
    user = null;
}
var address = S['address.' + user];
if (S.balanceUnits == null) {
    S.balanceUnits = 'balanceUSD';
}

function toggleBalanceUnits() {
    var units = Object.keys(displayCurrency);
    var i = (units.indexOf(S.balanceUnits) + 1) % units.length;
    return (S.balanceUnits = units[i]);
}

function currencyString(balance) {
    var meta = displayCurrency[S.balanceUnits];
    var quantity = balance[S.balanceUnits];
    if (meta.precision) {
        quantity = quantity.toFixed(meta.precision);
    }
    return meta.unit + quantity;
}

function insertBalance() {
    $.getJSON(api.balance, {
        username: user,
        address: address
    }, function (balance) {
        if (!('balanceBTC' in balance)) {
            /* Probably got the address wrong. */
            S.removeItem('address.' + user);
            return;
        }
        var units = S.balanceUnits;
        $('#header-bottom-right form.logout').before($('<span>|</span>').attr({
            'class': 'separator'
        })).prev().before($('<a/>').attr({
            'class': 'hover',
            'href': '#'
        }).on('click', function() {
            toggleBalanceUnits();
            $(this).text(currencyString(balance));
        }).text(currencyString(balance)));
    });
}

if (user != null && address == null) {
    $.getJSON('/message/messages.json', function(messages) {
        /* Search messages for a bitcointip response. */
        address = messages.data.children.filter(function (message) {
            return message.data.author === 'bitcointip';
        }).map(function (message) {
            var pattern = /Deposit Address: \| \[\*\*([a-zA-Z0-9]+)\*\*\]/;
            var address = message.data.body.match(pattern);
            if (address) {
                return address[1];
            } else {
                return false;
            }
        }).filter(identity)[0]; // Use the most recent
        if (address) {
            S['address.' + user] = address;
            insertBalance();
        }
    });
} else if (user != null && address != null) {
    insertBalance();
}

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

    /** Get the commenter/poster name for the first selected comment. */
    $.fn.thingName = function() {
        return this.first().find('.author').first().text();
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

    /** Return the link ID for the first post in the selection. */
    $.fn.postID = function() {
        return this.attr('data-fullname').replace(/^t._/, '');
    };

    /** Return true if the first seleted item is a comment. */
    $.fn.isComment = function() {
        return this.closest('.link').length === 0;
    };
})(unsafeWindow.jQuery);

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

/* Get status information about various tips. */
var inTipSubreddit = /^\/r\/bitcointip/.test(document.location.pathname);
var tipIDs = Object.keys(tips);
var confirmedIDs = [];
if (tipIDs.length > 0 || inTipSubreddit) {
    var iconStyle = 'vertical-align: text-bottom; margin-left: 8px;';
    $.getJSON(api.gettips + 'tips=' + tipIDs, function(response) {
        var lastEvaluated = new Date(response.last_evaluated * 1000);
        if (inTipSubreddit) {
            var botStatus = null;
            if (Date.now() - lastEvaluated > botDownThreshold) {
                botStatus = botStatusHtml.down;
            } else {
                botStatus = botStatusHtml.up;
            }
            $('a[href="http://bitcointip.net/status.php"]').html(botStatus);
        }

        response.tips.forEach(function (tip) {
            var id = tip.fullname.replace(/^t._/, '');
            var tagline = tips[id].find('.tagline').first();
            var icon = $('<a/>').attr({href: tip.tx, target: '_blank'});
            tagline.append(icon.append($('<img/>').attr({
                src: icons[tip.status],
                style: iconStyle,
                title: '+$' + tip.amountUSD + '	→  ' + tip.receiver + ' (' + tip.status + ')'
            })));
            confirmedIDs.push(id);
            tips[id].attr('id', 't1_' + id);
            delete tips[id];
        });

        /* Deal with unanswered tips. */
        for (var id in tips) {
            if (tips[id].commentDate() < lastEvaluated) {
                var tagline = tips[id].find('.tagline').first();
                tagline.append($('<img/>').attr({
                    src: icons.cancelled,
                    style: iconStyle,
                    title: 'This tip is invalid.'
                }));
            }
        }
    });

    /* Put receiver information on comments. */
    var things = {};
    $('div.comment').each(function() {
        var $this = $(this);
        things[$this.commentID()] = $this;
    });
    $('div.link').each(function() {
        var $this = $(this);
        things[$this.postID()] = $this;
    });
    var thingIDs = Object.keys(things);
    $.getJSON(api.gettipped + 'tipped=' + thingIDs, function(response) {
        response.forEach(function (tipped) {
            var id = tipped.fullname.replace(/^t._/, '');
            var thing = things[id];
            var tagline = thing.find('.tagline').first();
            var plural = tipped.tipQTY > 1;
            var title = '$' + tipped.amountUSD + ' to ' + thing.thingName() +
                    ' for this ';
            if (plural) {
                title = 'redditors have given ' + title;
            } else {
                title = 'a redditor has given ' + title;
            }
            if (thing.isComment()) {
                title += 'comment.';
            } else {
                title += 'submission.';
            }
            var icon = $('<img/>').attr({
                src: icons.tipped,
                style: iconStyle,
                title: title
            });

            /* Attempt to link to the first tip. */
            var foundParent = false;
            thing.commentChildren().each(function() {
                if (!foundParent) {
                    var $this = $(this);
                    var id = $this.commentID();
                    if ($.inArray(id, confirmedIDs) >= 0) {
                        icon = $('<a/>').attr({
                            href: '#t1_' + $this.commentID()
                        }).append(icon);
                        foundParent = true;
                    }
                }
            });

            tagline.append(icon);
            if (plural) {
                tagline.append('x' + tipped.tipQTY);
            }
        });
    });
}

/* Test URLs:
 *
 * Rejected,
 *   http://www.reddit.com/r/bitcointip/comments/132nhq/t/c7c7iue
 *
 * Rejected flip,
 *   http://www.reddit.com/r/Bitcoin/comments/14i9e7/y/c7dc6w9
 *
 * Combination folding,
 *   http://www.reddit.com/r/bitcointip/comments/13iykn/b/c7dj8ia
 *
 * Multiple tips to one receiver,
 *   http://www.reddit.com/r/bitcointip/comments/12lmut/c7ny177
 *
 * Multiple guilded to one receiver (for comparison),
 *   http://www.reddit.com/r/AdviceAnimals/comments/15mk25/c7ntrcc
 *
 * Reversed,
 *   http://www.reddit.com/r/IAmA/comments/18tp7t/c8i8qto
 */
