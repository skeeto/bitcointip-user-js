// ==UserScript==
// @name         Bitcoin Tip Support on Reddit
// @description  Add a tipping button (/u/bitcointip) and shrinks verifications
// @version      1.1.4
// @license      Public Domain
// @include      http://*.reddit.com/r/*
// ==/UserScript==

/* Changelog:
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
var tipregex = /((\+(bitcointip|bitcoin|tip|btctip|bittip|btc))|((\+((?!0)(\d{1,4})) internet(s)?)|(\+((?!0)(\d{1,4})) point(s)? to (Gryffindor|Slytherin|Ravenclaw|Hufflepuff))))/i;
var iconurl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAC4lBMVEUAAACPaQt2UQBUNQCjfBuGXwUYCQCgeBp+WgOXcBN1UwI+IQCWbxJ3VABNNQB4TABqRwCDXgWheRq0iyvEmzvNpkXNp0e/lzepgSOQaQ5mQwCVbxG1jS3WrUrJoUGfeBt4UgCXbxK9lTXdvl+ifyRyTQB1TQC5kzXZwWSTcBU+HAClgSXbv2e6mjl6VgG6mkCOahHJrFKeeR7QtlqmgCTPsVKkfiPGokOYchq0jS6FYQuedhjOqUqshCp0UgBpQgCshifeuVuEYQtaPQCOZgmyjC/iwmqNaxZtSwCLYwapiDDLtWa1mkmIZhJqPACOaA6hfiSwjjS3lj20kzylhC6PbBZ4VAJgPgDxyWP61G/60m72zWn0y2jqwWDqwmD71G/sxGHXrlDNpEXRqUvhuF330Xj61nvsx2b30XDUqUu8kDTGplfEp13TuG/Mp1X0znb53IH+8pT94Inar1XDnEjQsWbfxoHhy4nq1JPWu3LjyXb12Hr54YP76Ynz4Izx1YTYrVrQq1vcw3776KnexoHZvnby3p3q1ZHfv2b50nH84H3fwF3765fqx3XgtWPds2LPrWD346TDplrGoUjfxn/Wslr3y2r30nHyz2z97pbtyHHrwW7rwnHcum345KXizIjhyYL45KTgyobKpErou1zvxGf40HD95ovvyW/yyXL4033myHn45aXRuHHFp1zWvHb55abXuW3Vp0zqv2X40HH73X/403b70XX8137jx3j35KTKrmTOrFrLrmLbwHnJnUTqwGPvxWXuy2v613n1y23syHTs1pL756jr1pTq04/y3Zzp05G+m0rNoEL0xmTVqkv103Xxy2zlvmbPsGPXv3nZw3/kzozBoli5kkC9kDfitFX1yGj31XjyzXHbs1zSsmbKrWTUuXLIoVPWr2Dmxnj82ofJpEz96Jj43I3qynrkxHXkxnvt1Y768K/79bTNuWrpz4H434z85ZT855v25JrgzoNc4s0oAAAAWHRSTlMAAAAAAAAAAAAAAAAAAAAAAAhNrej9/OKhQAUal/HqhhIZs/2mFAaT/ooESe3qQ6Wh4OD4+ff63eOfqULq7kwEif6WBxSn/bYbE4Xp8ZgEPZzd+fvmrE0I3zUSGwAAAItJREFUGBkFwaEOQVEAANB7JpgJNJsPUAQzM7PHnqSKbCRB0RRN0BRJIgmvayYIbPyI2URTbeYcIcgDeP2ClAIRuPAkXdQCOPNQ0gHgiLIuAA5UegAgUR0CfHLYqk0AwFp9BgCWGguAe4S55goATEU2ABgTswNgRCZiDzBwldUmAX3fGyHkYgCnd/gD0ZIbTk0W89sAAAAASUVORK5CYII=";

/* Add the button. */
var $ = unsafeWindow.$, reddit = unsafeWindow;
var tip = $('<a>tip bitcoins</a>').attr({
    'class': 'tip-bitcoins login-required',
    'href': '#'
});
$('a.give-gold').parent().after($('<li></li>').append(tip));

/* Button functionality. */
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

/* Get the comment's content body. */
function getBody(element) {
    return getComment(element).find('.md').first();
}

/* Get the children comments of this comment. */
function getChildren(element) {
    return getComment(element).find('.comment');
}

/* Return true if the element's comment is the target of the URL. */
function isTarget(element) {
    return getComment(element).find('form').first().hasClass('border');
}

/* Hide verification posts. Note: t2_7vw3n is /u/bitcointip. */
getComment($('a.id-t2_7vw3n')).each(function() {
    var $this = $(this);

    /* Hide bitcointip's reply (maybe). */
    if (getChildren($this).length === 0 && !isTarget($this)) {
        var expand = $this.find('.expand').first();
        reddit.hidecomment(expand);
    }

    /* Determine status. */
    var status = "Rejected", amount = '';
    getBody($this).children().each(function() {
        var $this = $(this);
        if (/Verified/.test($this.text())) {
            status = "Verified";
            amount = $this.text().match(/> *([^ ]+ BTC)/)[1];
        }
    });

    /* Mark the tip. */
    getBody($this.parent()).children().each(function() {
        var $this = $(this);
        if (tipregex.test($this.text())) {
            var icon = $('<img/>').attr({
                src: iconurl,
                style: 'display: inline; vertical-align: middle;'
            });
            $this.append(' &mdash; ');
            $this.append(icon);
            $this.append(" <b>" + status + "</b>");
            if (amount) {
                $this.append(" [" + amount + "]");
            }
        }
    });
});

/*
 * Useful tests:
 *  http://www.reddit.com/r/bitcointip/comments/13iykn/b/c7dj8ia
 *  http://www.reddit.com/r/bitcointip/comments/132nhq/t/c7c7iue
 *  http://www.reddit.com/r/Bitcoin/comments/14i9e7/y/c7dc6w9
 *  http://www.reddit.com/r/Bitcoin/comments/14qysn/
 */
