
modules['bitcoinTip'] = {
    moduleID: 'bitcoinTip',
    moduleName: 'bitcoinTip',
    category: 'Users',
    description: 'Send <a href="http://bitcoin.org/" target="_blank">' +
        'bitcoin</a> to other redditors  via <a href="/r/bitcointip" ' +
        'target="_blank">bitcointip</a>. <br><br>' +
        'For more information, visit <a href="/r/bitcointip" ' +
        'target="_blank">/r/bitcointip</a>  or <a href="/13iykn" ' +
        'target="_blank">read the documentation</a>.',
    isEnabled: function() {
        return RESConsole.getModulePrefs(this.moduleID);
    },
    include: Array(
            /https?:\/\/([a-z]+).reddit.com\/[\?]*/i
    ),
    exclude: Array(
            /https?:\/\/([a-z]+).reddit.com\/[\?]*\/user\/bitcointip\/?/i
    ),
    isMatchURL: function() {
        return RESUtils.isMatchURL(this.moduleID);
    },
    beforeLoad: function() {
        RESUtils.addCSS('.tip-bitcoins { cursor: pointer; }');
        RESUtils.addCSS('.tips-enabled-icon { cursor: help; }');
        RESUtils.addCSS('#tip-menu { display: none; position: absolute; top: 0; left: 0; }');
    },
    /** Specifies how to find tips. */
    tipregex: /\+(bitcointip|bitcoin|tip|btctip|bittip|btc)/i,
    tipregexFun: /(\+((?!0)(\d{1,4})) (point|internet|upcoin))/,

    /** How many milliseconds until the bot is considered down. */
    botDownThreshold: 15 * 60 * 1000,

    /** Bitcointip API endpoints. */
    api: {
        gettips: 'https://bitcointip.net/api/gettips.php',
        gettipped: 'https://bitcointip.net/api/gettipped.php',
        subreddits: 'https://bitcointip.net/api/subreddits.php',
        balance: 'https://bitcointip.net/api/balance.php'
    },

    /** Encoded tipping icons. */
    icons: {
        completed: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAMAAABFNRROAAAAt1BMVEX///8AAAAAyAAAuwAAwQcAvAcAvwAAwQYAyAUAxAUAxwQAwgQAvAMAxQYAvwYAxQYAxwU5yT060j460j871T89wUE9wkFGokdGu0hIzExJl09JmE9JxExJxE1K1U9K1k5Ll09LmVNMmVNM2FBNmlRRx1NSzlRTqlVUslZU1ldVq1hVrFdV2FhWrFhX21pZqlphrWJh3WRotGtrqm1stW91sXd2t3h5t3urz6zA2sHA28HG3sf4+PhvgZhQAAAAEXRSTlMAARweJSYoLTM0O0dMU1dYbkVIv+oAAACKSURBVHjaVc7XEoIwEIXhFRED1tBUxBaPFSyxK3n/5zIBb/yv9pudnVky2Ywxm345MHkVXByllPm4W24qrLbzdo1sLPPRepc+XlnSIAuz9DQYPtXnkLhUF/ysrndV3CYLRpbg2VtpxFMwfRfEl8IghEPUhB9t9lEQoke6FnzONfpU5kEIoKOn/z+/pREPWTic38sAAAAASUVORK5CYII=",
        cancelled: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAMAAABFNRROAAAAQlBMVEX///+qAAAAAAC/AADIABSaTU3YMDDcPj7cSEjeUFDiZGTld3fmfHzoiorqkJDqlpbupKTuqqr99fX99/f+/Pz////kWqLlAAAABXRSTlMAAwcIM6KYVMQAAABfSURBVHjaXc7JDsAgCEVRsYpIBzro//9qHyHpond3AgkklIuXPKJcqleIIEB6FwEhQEW0t4rlUtt+22ZTMQ09NqZyiK8BtBCvc9iDWegY526hBVRmdcQ9RgD9f/G+P1+JEwRF2vKhRgAAAABJRU5ErkJggg==",
        tipped: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAANCAMAAACq939wAAAA/FBMVEWqVQCqcQCZZgCLXQCdYgDMjACOXACOXwCacQCfcQCqegCwggChggCnfwCwggCthACtgQC9iACleQC+iwDMlgDJlACmfgDDiwDBjADHlQDJnQDFlQDKmAChfRGjgBOmfhKmghKnghOqhBKthxOviROvjB+vjCGvjCOwiRSwihixixWxjSGziBOzkSmzky+0kSa0kiy3jxW8kxS8mCi8n0i8oEq9lBe9mSvOoBbUrTTUrTjbukXcsTDctDrdtj/exHbexXDfwWXfwmvjrBnksRjksx7lrhnqx17qyWTqymrq377rz3nr2qftuiHtvSv67cD67sj+997/+OX///8rcy1sAAAAHXRSTlMDCQoLDRQkKystMDc5Oj0+QUlKS0tMTVFSV15/i6wTI/gAAACWSURBVHjaHcrnAoFQGADQryI7sjNKN0RKZJVNQ8io938YN+f3ASDp1B9NAhD15UzXNH26KhNQXZyDBxZcNlloKadvFIbR56owUOFV9425ai8PrGwZaITQeisXoKHs7k/MP44ZaHYl54U5El8EdmjNEWbEjesf/Ljd9v0S1ETBtD3PNgUxB8nOQIybOGknAKgMy2FsmoIflIEZdK7PshkAAAAASUVORK5CYII=",
        pending: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAABWUlEQVR4nI2Sy0sCURTGD6S2jjYFrdy0DNpEhokb8zFm5YyaO6NFYNGqF/0hPZYtR79FUbgw0BFtDKIgUCSpv8Od3XtGJzWDBj64h/l+954XdbtdGhQZkzNUd7ptifiXZygo0Wz0WsWoyHTMj4Wo6nRLQ7KdRuZz15bWSiF0GQOVXJ4hqP/COGDTjEO9SyByIcDHiUXiT+QsAaW1wabgi4KtVxVqM4lQVcFx4RS5tzy0vIgZFDVTnaYkFG6us2lbTyNws4ZAMYizwjk6nQ7KbQOJfMqCRBlERZpWruJYfvYigx02ZfUDHN2e8Pnpy8T+w6G4MIqI8HFH5Ut9SKZQ/jDYPAh4K36EGzGrkwz1avK8+/jn3n2WzaPASsNnQaJpvYG65ixwFV7Dj7iuQcul+Cwvs4Ga1fafOVUcC31Qpio1BJjO0PiNEJPn9osapeyNqLmW/lyj/+7eN1qRZT0kKLSqAAAAAElFTkSuQmCC",
        reversed: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAABOklEQVR42p2SvU4CQRSFj+9h7DQ2VmsDCy0/Cw2wsNtuRwixIiQ8CZaWGDBaaAiJyVAg2xi1AaTQ19jyOHeSIbLBxuIkM7Pn23PvnQHJPSngNAYcK9mnPWng/LpaZVoadg9CC+BSDNsg4FcU7bRpNjkslaiAYAfZhL+AuFbjQ6PBYaXCZ6AK4Mj0IMBGH4rptVjkW73Ote9zUS5z2u/zfTzmRBL1XoNniIFjgdaeZ0yjMORNocCZ1nQwYJIk3CrFSatlIGkDM+BEouNMhndRZEyjTof3vZ5Zfy+XfOp2zQ+ND3BMkoWkhE+lxLwHzPN5rjzPTtLZ9fSRzZqPj+22MaeBlesaSIZmp3dhQZXLcaQHcev7sjZnFngBwr17mgNFC+pSRRawZV0dfBFy89ogDYvEbBMav33/ens/XHaDp7U/bFsAAAAASUVORK5CYII="
    },

    /** Specifies how to display different currencies. */
    currencies: {
        USD: {unit: 'US$', precision: 2},
        BTC: {unit: '฿'},
        JPY: {unit: '¥'},
        GBP: {unit: '£', precision: 2},
        EUR: {unit: '€', precision: 2},
        AUD: {unit: 'A$', precision: 2},
        CAD: {unit: 'C$', precision: 2}
    },

    options: {
        baseTip: {
            name: 'Default Tip',
            type: 'text',
            value: '0.01 BTC',
            description: 'Default tip amount in the form of ' +
                '"[value] [units]", e.g. "0.01 BTC"'
        },
        attachButtons: {
            name: 'Add "tip bitcoins" Button',
            type: 'boolean',
            value: true,
            description: 'Attach "tip bitcoins" button to comments'
        },
        hide: {
            name: 'Hide Bot Verifications',
            type: 'boolean',
            value: true,
            description: 'Hide bot verifications'
        },
        status: {
            name: 'Tip Status Format',
            type: 'enum',
            values: [
                { name: 'detailed', value: 'detailed' },
                { name: 'basic', value: 'basic' },
                { name: 'none', value: 'none' }
            ],
            value: 'detailed',
            description: 'Tip status - level of detail'
        },
        currency: {
            name: 'Preferred Currency',
            type: 'enum',
            values: [
                { name: 'BTC', value: 'BTC' },
                { name: 'USD', value: 'USD' },
                { name: 'JPY', value: 'JPY' },
                { name: 'GBP', value: 'GBP' },
                { name: 'EUR', value: 'EUR' }
            ],
            value: 'USD',
            description: 'Preferred currency units'
        },
        balance: {
            name: 'Display Balance',
            type: 'boolean',
            value: true,
            description: 'Display balance'
        },
        subreddit: {
            name: 'Display Enabled Subreddits',
            type: 'boolean',
            value: true,
            description: 'Display enabled subreddits'
        },
        address: {
            name: 'Known User Addresses',
            type: 'table',
            addRowText: '+add address',
            fields: [
                {name: 'user', type: 'text'},
                {name: 'address', type: 'text'}
            ],
            value: [
                /* ['skeeto', '1...'] */
            ],
            description: 'Mapping of usernames to bitcoin addresses'
        }
    },

    /** Return a DOM element to separate items in the user bar. */
    separator: function() {
        return $('<span>|</span>').addClass('separator');
    },

    /** Convert a quantity into a string. */
    quantityString: function quantityString(object) {
        var pref = this.options.currency.value.toUpperCase();
        var unit = this.currencies[pref];
        var amount = object['amount' + pref] || object['balance' + pref];
        if (amount == null) {
            amount = object['amountBTC'] || object['balanceBTC'];
            unit = this.currencies['BTC'];
        }
        if (unit.precision) {
            amount = parseFloat(amount).toFixed(unit.precision);
        }
        return unit.unit + amount;
    },

    tipPublicly: function tipPublicly($target) {
        var form = null;
        if ($target.closest('.link').length > 0) { /* Post */
            form = $('.commentarea .usertext:first');
        } else { /* Comment */
            $target.closest('ul').find('a[onclick*="reply"]').click();
            form = $target.thing().find('FORM.usertext.cloneable:first');
        }
        var textarea = form.find('textarea');
        if (!textarea.val().match(this.tipregex)) {
            textarea.val(textarea.val() + '\n\n+bitcointip ' +
                         this.options.baseTip.value);
            textarea.setCursorPosition(0);
        }
    },

    tipPrivately: function tipPrivately($target) {
        var form = null;
        if ($target.closest('.link').length > 0) { /* Post */
            form = $('.commentarea .usertext:first');
        } else {
            form = $target.thing().find(".child .usertext:first");
        }
        if (form.length > 0 && form.find('textarea').val()) {
            /* Confirm if a comment has been entered. */
            if (!confirm('Really leave this page to tip privately?')) {
                return;
            }
        }
        var user = $target.thing().find('.author:first').text();
        var msg = encodeURIComponent('+bitcointip @' + user + ' ' +
                                         this.options.baseTip.value);
        var url = '/message/compose?to=bitcointip&subject=Tip&message=' + msg;
        window.location = url;
    },

    attachTipButtons: function attachTipButtons() {
        /* Add the "tip bitcoins" button after "give gold". */
        var tip =
        $('<span class="tip-wrapper">' +
              '<div class="dropdown">' +
                '<a class="tip-bitcoins login-required" title="Click to give a bitcoin tip">tip</a>' +
              '</div>' +
            '</span>');

        tip.live('click', function(e) {
            modules['bitcoinTip'].toggleTipMenu(e.target);
        });

        if (/^\/r\//.test(document.location.pathname)) {
            // this operation should be chunked. On monster comment pages, it will lock UI hard. if we use the old code, which is:
            // $('a.give-gold').parent().after($('<li/>').append(tip.clone()));
            var allGiveGoldLinks = document.body.querySelectorAll('a.give-gold');
            RESUtils.forEachChunked(allGiveGoldLinks, 15, 1000, function(giveGold, i, array) {
                $(giveGold).parent().after($('<li/>').append(tip.clone(true)));
            });
            if ($('.link').length === 1) { // Viewing a submission?
                $('.link ul.buttons').append($('<li/>').append(tip.clone(true)));
            }
         }
    },

    attachTipMenu: function() {
        this.tipMenu = 
            $('<div id="tip-menu" class="drop-choices">' +
                '<a class="choice tip-publicly" href="javascript:void(0);">tip publicly</a>' +
                '<a class="choice tip-privately" href="javascript:void(0);">tip privately</a>' +
                modules['settingsNavigation'].makeUrlHashLink('bitcoinTip', null, 
                    '<img src="' + this.icons.tipped + '"> bitcointip', 'choice') +
               '</div>');
         $(document.body).append(this.tipMenu);

        $('.tip-publicly').click(function(event) {
            event.preventDefault();
            bitcoinTip.tipPublicly($(event.target));
        });

        $('.tip-privately').click(function(event) {
            event.preventDefault();
            bitcoinTip.tipPrivately($(event.target));
        });
    },

    attachSubredditIndicator: function() {
        var subreddit = RESUtils.currentSubreddit();
        if (subreddit) {
            $.getJSON(this.api.subreddits, function(data) {
                if (data.subreddits.indexOf(subreddit.toLowerCase()) >= 0) {
                    $('#header-bottom-right form.logout')
                        .before(this.separator()).prev()
                        .before($('<img/>').attr({
                            'src': this.icons.tipped,
                            'class': 'tips-enabled-icon',
                            'style': 'vertical-align: text-bottom;',
                            'title': 'Tips enabled in this subreddit.'
                        }));
                }
            }.bind(this));
        }
    },

    go: function() {
        if ((this.isEnabled()) && (this.isMatchURL())) {
            // copied and adjusted from http://userscripts.org/scripts/review/153975 with permission from the authors
            var botStatusHtml = {
                up: '<span class="status-up">UP</span>',
                down: '<span class="status-down">DOWN</span>'
            };

            // var $ = unsafeWindow.$,
            //     S = unsafeWindow.localStorage,
            //     reddit = unsafeWindow;

            /* Helper functions. */

            function identity(x) {
                return x;
            }

            /**
             * Set textarea cursor position in jQuery.
             */
            $.fn.setCursorPosition = function(pos) {
                this.each(function(index, elem) {
                    if (elem.setSelectionRange) {
                        elem.setSelectionRange(pos, pos);
                    } else if (elem.createTextRange) {
                        var range = elem.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', pos);
                        range.moveStart('character', pos);
                        range.select();
                    }
                });
                return this;
            };


            /* Balance indicator. */
            var user = $('#header-bottom-right span.user a').first().text();
            if (user === "login or register") {
                user = null;
            }
            // TODO: replace S[] whatever with RESStorage
            // var address = S['address.' + user];
            var address = null;
            if (!this.options.balanceUnits) this.options.balanceUnits = {};
            if (this.options.balanceUnits.value == null) {
                this.options.balanceUnits.value = 'balanceUSD';
            }

            function toggleBalanceUnits() {
                var units = Object.keys(displayCurrency);
                var i = (units.indexOf(modules['bitcoinTip'].options.balanceUnits.value) + 1) % units.length;
                modules['bitcoinTip'].options.balanceUnits.value = units[i];
                return modules['bitcoinTip'].options.balanceUnits.value;
            }

            function currencyString(balance) {
                var balanceUnits = modules['bitcoinTip'].options.balanceUnits.value;
                var meta = displayCurrency[balanceUnits];
                var quantity = balance[balanceUnits];
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
                    var units = modules['bitcoinTip'].options.balanceUnits.value;
                    $('#header-bottom-right form.logout').before(...)
                        .prev().before($('<a/>').attr({
                        'class': 'hover',
                        'href': '#'
                    }).bind('click', function() {
                        toggleBalanceUnits();
                        $(this).text(currencyString(balance));
                    }).text(currencyString(balance)));
                });
            }

            if (this.options.balance.value && user != null && address == null) {
                // this can NOT be called on every page load... not with RES's huge userbase....
                var lastCheck = parseInt(RESStorage.getItem('RESmodules.bitcoinTip.lastCheck.'+RESUtils.loggedInUser()), 10) || 0;
                var now = new Date();
                // 300000 = 5 minutes... we don't want to annoy Reddit's servers too much with this query...
                if ((now.getTime() - lastCheck) > 300000) {
                    $.getJSON('/message/messages.json', function(messages) {
                        RESStorage.setItem('RESmodules.bitcoinTip.lastCheck.'+RESUtils.loggedInUser(), now.getTime());                      
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
                            // S['address.' + user] = address;
                            insertBalance();
                        }
                    });
                }
            } else if (this.options.balance.value && user != null && address != null) {
                insertBalance();
            }

            /* Reddit jQuery plugin. */
            // passing in jquery is unnecessary here - we already have access to it.
            // (function($) {
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

                /** Return true if the first comment in the current set has a "fun" tip. */
                $.fn.hasFunTip = function() {
                    return this.commentBody().children().is(function() {
                        return tipregexFun.test($(this).text());
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
            // })(unsafeWindow.jQuery);

            /* Hide verification replies. Note: t2_7vw3n is /u/bitcointip. */
            if (this.options.hide.value) {
                $('a.id-t2_7vw3n').comment().each(function() {
                    var $this = $(this);
                    if ($this.commentChildren().length === 0 && !$this.isTarget()) {
                        // TODO: figure out a way to get this working.
                        // reddit.hidecomment($this.find('.expand').first());
                    }
                });
            }

            /* Find all the tip comments. */
            var tips = {};
            var fun = {};
            $('div.comment').each(function() {
                var $this = $(this);
                if ($this.hasTip()) {
                    tips[$this.commentID()] = $this;
                } else if ($this.hasFunTip()) {
                    tips[$this.commentID()] = $this;
                    fun[$this.commentID()] = $this;
                }
            });

            /* Get status information about various tips. */
            var inTipSubreddit = /^\/r\/bitcointip/.test(document.location.pathname);
            var tipIDs = Object.keys(tips);
            var confirmedIDs = [];
            if (this.options.status.value !== 'none' && (tipIDs.length > 0 || inTipSubreddit)) {
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
                            src: modules['bitcoinTip'].icons[tip.status],
                            style: iconStyle,
                            title: ...(tip) + ' → ' + tip.receiver +
                                ' (' + tip.status + ')'
                        })));
                        confirmedIDs.push(id);
                        tips[id].attr('id', 't1_' + id);
                        delete tips[id];
                    });

                    /* Deal with unanswered tips. */
                    for (var id in tips) {
                        if (!fun[id] && tips[id].commentDate() < lastEvaluated) {
                            var tagline = tips[id].find('.tagline').first();
                            tagline.append($('<img/>').attr({
                                src: modules['bitcoinTip'].icons.cancelled,
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
                        var title = ...(tipped) + ' to ' + thing.thingName() +
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
                            src: modules['bitcoinTip'].icons.tipped,
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
                            tagline.append($('<span/>').text('x' + tipped.tipQTY));
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

        }
    },
    toggleTipMenu: function(ele) {
        var tipMenu = modules['bitcoinTip'].tipMenu;
        var thisXY = $(ele).offset();
        var thisHeight = $(ele).height();
        // if already visible and we've clicked a different trigger, hide first, then show after the move.
        if (($(tipMenu).is(':visible')) && (modules['bitcoinTip'].lastToggle !== ele)) {
            $(tipMenu).toggle();
        }
        $(tipMenu).css({
            top: (thisXY.top+thisHeight)+'px',
            left: thisXY.left+'px'
        });
        $(tipMenu).toggle();
        modules['bitcoinTip'].lastToggle = ele;
    }
}; // note: you NEED this semicolon at the end!