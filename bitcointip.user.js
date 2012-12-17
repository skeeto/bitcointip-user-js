// ==UserScript==
// @name         Extra Bitcointip Support on Reddit
// @description  Add a tipping button (/u/bitcointip) and shrinks verifications
// @version      1.2
// @license      Public Domain
// @include      http://*.reddit.com/*
// ==/UserScript==

/* Changelog:
 * 1.2
 *    Use the new bitcointip API to get status information
 *    https://github.com/NerdfighterSean/bitcointip/blob/master/src/api/gettips.php
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
var api = 'http://bitcointip.net/api/gettips.php?callback=?';
var tipregex = /((\+(bitcointip|bitcoin|tip|btctip|bittip|btc))|((\+((?!0)(\d{1,4})) internet(s)?)|(\+((?!0)(\d{1,4})) point(s)? to (Gryffindor|Slytherin|Ravenclaw|Hufflepuff))))/i;
var iconurl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3AsUFTg5U/TSRQAAA2pJREFUOMtdk1toWwUAhr9zy0ly0pwmTdJ2SWqv2jm3trrVbrODOZk3HF4QRZwVVBR9E8QLylSY4ARfRHSiMlnFIUXm5pjY2VI6N2StoE3baWurtl26pElzbe7n+DCs0//5+7+Xn1/gf/ns9c49mk183FdXv1NRhGDFMFOrscTEcjh6vGgoR547NJm4mhfWi292uzSl8PHWHT33B5taEUQR0/wXSsRX+GH4+/jF2cgbrg2d7z35ynFzXfDJqzfo9T5tePed93QpisKl2QnW8gKxxUnc/nY0VcTXtBHFamPs3AjfnDzT72/r7XvmwLeGCODW5Q9237Wvq1Iucu5kP7+cH0ar6yKSEtEDPaxeDpP6a4pcOs62XbdyS+/WR/+YHj0AIH5+cFt3x807H1YsVkIjpymhoTd0Y7XbqW/uQLYo5EUnhihQjMxRyKTo3bMXt2556eCz17WImk14oqG5TYgtzKNabLi8QZo378Dt8dDY+SAV7Nx02yNEcjqlco7UwgxWm53OG7dYEisLT4veurpdkiSRXVlGVW2olRSJ8CwAZ798gdnR98mkkzhcPtLJJJVcknJ+jcaWFiTB2CtbVCUAJrJYpsqpYSJRVFUANvXcjavGi6NKZ3z0FLXyGoIhUcrncDirETBbRbNSqVzZy0BWBJy6HZvtiuC3yXFCF4YIL87Te/tDrCRNCvkigixjGAaGaSpiNp2ewzRxuNwoMpTKRUrlCgCKmcNpKVDMJpBkGVOxIUgKFruDWDSCibgohxcXBnNrmS61uo74fISYoXNtVycA2+/Yj9VmQ5ZVJi6M4LIW8QZbkSSZi6EQhimOiqK1/qPpn38qqboXWasmG51hcOBDwkthzg6eYDWWYujYIaTYOJ6aWnR/M5HlS4QmfjUdzppPpYEzf65ubytY/YFAr7ehDU0xEQpJ7O5GUtE5anxB/M4iWnU9ntYOTFFmoP8oy9Hsibf6Y29LAE/1PTAyOTbYXrshsKn2mnaqfX6KqSVqXE4op3AFWnEGWiiUy3z1xVFCU/NTuid439BYPLd+pq8P7xcTyxMvNjYFXr5+S0eV2+NFFEVMBLKZNDPTIYa/GyQaL5z2BTb2Pf/Oj9H/vPGfHHt3n3dlafIxq1W9VxSMzdlsRsvljcuZteJ5xaofee3w76eu5v8GlyNbHypvS6QAAAAASUVORK5CYII=";

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

/* Get the top div container for the comment containing the element. */
function getComment(element) {
    return element.closest('.comment');
}

function getCommentID(comment) {
    var fullname = comment.find('input[name="thing_id"]').first().val();
    return fullname.replace(/^t1_/, '');
}

/* Get the comment's content body. */
function getBody(element) {
    return getComment(element).find('.md').first();
}

/* Get the children comments of this comment. */
function getChildren(element) {
    return getComment(element).find('.comment');
}

/* Get the parent comment of this comment. */
function getParent(element) {
    return getComment(getComment(element).parent());
}

/* Return true if the element's comment is the target of the URL. */
function isTarget(element) {
    return getComment(element).find('form').first().hasClass('border');
}

function getCommentTip(comment) {
    var tip = null;
    getBody(comment).children().each(function() {
        if (!tip && tipregex.test($(this).text())) {
            tip = $(this);
        }
    });
    return tip;
}

/* Hide verification replies. Note: t2_7vw3n is /u/bitcointip. */
getComment($('a.id-t2_7vw3n')).each(function() {
    var $this = $(this);
    if (getChildren($this).length === 0 && !isTarget($this)) {
        var expand = $this.find('.expand').first();
        reddit.hidecomment(expand);
    }
});

/* Find all the tip comments. */
var tips = {};
$('div.comment').each(function() {
    var $this = $(this);
    var tip = getCommentTip($this);
    if (tip) tips[getCommentID($this)] = tip;
});

/* Get status info and update the tip's comment body. */
if (Object.keys(tips).length > 0) {
    var display = {
        "pending": "Verified",
        "completed": "Verified",
        "reversed": "Verified",
        "cancelled": "Rejected"
    };
    $.getJSON(api + '&tips=' + Object.keys(tips), function(response) {
        response.forEach(function (tip) {
            var node = tips[tip.fullname.replace(/^t1_/, '')];
            node.append(' &mdash; ');
            node.append($('<img/>').attr({
                src: iconurl,
                style: 'display: inline; vertical-align: middle;'
            }));
            node.append(' <b>' + display[tip.status] + '</b>');
            node.append(' &rarr; ');
            node.append($('<a>' + tip.amountBTC + ' BTC</a>').attr({
                href: tip.tx
            }));
            node.append(' [' + tip.amountUSD + ' US$]');
        });
    });
}
