modules['bitcoinTip'] = {
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
        USD: {unit: '$', precision: 2},
        BTC: {unit: '฿'},
        JPY: {unit: '¥'},
        GBP: {unit: '£', precision: 2},
        EUR: {unit: '€', precision: 2}
    },

    options: {
        baseTip: {
            type: 'text',
            value: '0.01 BTC',
            description: 'Default tip amount in the form of ' +
                '"[value] [units", e.g. "0.01 BTC"'
        },
        attachButtons: {
            type: 'boolean',
            value: true,
            description: 'Attach "tip bitcoins" button to comments'
        },
        hide: {
            type: 'boolean',
            value: true,
            description: 'Hide bot verifications'
        },
        status: {
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
            type: 'text',
            value: 'BTC',
            description: 'Preferred currency (e.g. BTC, USD)'
        },
        balance: {
            type: 'boolean',
            value: true,
            description: 'Display balance'
        },
        subreddit: {
            type: 'boolean',
            value: true,
            description: 'Display enabled subreddits'
        },
        address: {
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
        var user = $(this).thing().find('.author:first').text();
        var msg = encodeURIComponent('+bitcointip @' + user + ' ' +
                                         this.options.baseTip.value);
        var url = '/message/compose?to=bitcointip&subject=Tip&message=' + msg;
        window.location = url;
    },

    attachTipButtons: function attachTipButtons() {
        var tip =
        $('<span class="tip-wrapper">' +
            '<div class="dropdown" onclick="open_menu(this)">' +
              '<a class="tip-bitcoins login-required">tip bitcoins</a>' +
            '</div>' +
            '<div class="drop-choices">' +
              '<a class="choice tip-publicly">tip publicly</a>' +
              '<a class="choice tip-privately">tip privately</a>' +
            '</div>' +
          '</span>');

        if (/^\/r\//.test(document.location.pathname)) {
            $('a.give-gold').parent().after($('<li/>').append(tip.clone()));
            if ($('.link').length === 1) { // Viewing a submission?
                $('.link ul.buttons').append($('<li/>').append(tip.clone()));
            }
        }

        $('.tip-publicly').click(function(event) {
            event.preventDefault();
            this.tipPublicly($(event.target));
        });

        $('.tip-privately').click(function(event) {
            event.preventDefault();
            this.tipPrivately($(event.target));
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
                            'style': 'vertical-align: text-bottom;',
                            'title': 'Tips enabled in this subreddit.'
                        }));
                }
            }.bind(this));
        }
    },

    hideVerifications: function hideVerifications() {
        /* t2_7vw3n is u/bitcointip. */
        $('a.id-t2_7vw3n').closest('.comment').each(function() {
            var $this = $(this);
            var isTarget = $this.find('form:first').hasClass('border');
            if ($this.find('.comment').length === 0 && isTarget) {
                //reddit.hidecomment($this.find('.expand').first());
                // XXX
            }
        });
    },

    toggleCurrency: function() {
        var units = Object.keys(this.currencies);
        var i = (units.indexOf(this.options.currency.value) + 1) % units.length;
        this.options.currency.value = units[i];
        this.save();
    },

    getAddress: function getAddress(user) {
        user = user || RESUtils.loggedInUser;
        var address = null;
        this.options.address.value.forEach(function(row) {
            if (row[0] === user) address = row[1];
        });
        return address;
    },

    setAddress: function setAddress(user, address) {
        user = user || RESUtils.loggedInUser;
        var set = false;
        this.options.address.value.forEach(function(row) {
            if (row[0] === user) {
                row[1] = address;
                set = true;
            }
        });
        if (user && !set) {
            this.options.address.value.push([user, address]);
        }
        this.save();
        return address;
    },

    attachBalance: function attachBalance() {
        var user = RESUtils.loggedInUser();
        var address = this.getAddress(user);
        if (!address) return;
        var bitcoinTip = this;

        $.getJSON(this.api.balance, {
            username: user,
            address: address
        }, function (balance) {
            if (!('balanceBTC' in balance)) {
                return; /* Probably have the address wrong! */
            }
            $('#header-bottom-right form.logout')
                .before(bitcoinTip.separator()).prev()
                .before($('<a/>').attr({
                    'class': 'hover',
                    'href': '#'
                }).click(function() {
                    bitcoinTip.toggleCurrency();
                    $(this).text(bitcoinTip.quantityString(balance));
                }).text(bitcoinTip.quantityString(balance)));
        });
    },

    fetchAddress: function fetchAddress(user, callback) {
        user = user || RESUtils.loggedInUser();
        callback = callback || function nop() {};
        if (!user) return;
        $.getJSON('/message/messages.json', function(messages) {
            /* Search messages for a bitcointip response. */
            var address = messages.data.children.filter(function (message) {
                return message.data.author === 'bitcointip';
            }).map(function (message) {
                var pattern = /Deposit Address: \| \[\*\*([a-zA-Z0-9]+)\*\*\]/;
                var address = message.data.body.match(pattern);
                if (address) {
                    return address[1];
                } else {
                    return false;
                }
            }).filter(function(x) { return x; })[0]; // Use the most recent
            if (address) {
                this.setAddress(user, address);
                callback(address);
            } else {
                callback(null);
            }
        }.bind(this));
    },

    /** Find all things matching a regex. */
    getTips: function getComments(regex) {
        var tips = {};
        $('div.comment, div.self, div.link').each(function() {
            var $this = $(this);
            var match = $this.find('.md:first, .title:first')
                    .children().is(function() {
                        return regex.test($(this).text());
                    });
            if (match) {
                var id = $this.attr('data-fullname');
                tips[id.replace(/^t._/, '')] = $this;
            }
        });
        return tips;
    },

    attachTipStatuses: function attachTipStatuses(tips) {
        var iconStyle = 'vertical-align: text-bottom; margin-left: 8px;';
        var icons = this.icons;
        var tipIDs = Object.keys(tips);
        $.getJSON(this.api.gettips, {
            tips: tipIDs.toString()
        }, function(response) {
            var lastEvaluated = new Date(response.last_evaluated * 1000);
            response.tips.forEach(function (tip) {
                var id = tip.fullname.replace(/^t._/, '');
                var tagline = tips[id].find('.tagline').first();
                var icon = $('<a/>').attr({href: tip.tx, target: '_blank'});
                tagline.append(icon.append($('<img/>').attr({
                    src: icons[tip.status],
                    style: iconStyle,
                    title: this.quantityString(tip) + ' → ' + tip.receiver +
                        ' (' + tip.status + ')'
                })));
                tips[id].attr('id', 't1_' + id); // for later linking
                delete tips[id];
            }.bind(this));

            /* Deal with unanswered tips. */
            for (var id in tips) {
                var date = tips[id].find('.tagline time:first')
                        .attr('datetime');
                if (new Date(date) < lastEvaluated) {
                    var tagline = tips[id].find('.tagline:first');
                    tagline.append($('<img/>').attr({
                        src: icons.cancelled,
                        style: iconStyle,
                        title: 'This tip is invalid.'
                    }));
                }
            }
        }.bind(this));
    },

    attachReceiverStatus: function attachReceiverStatus(things) {
        var iconStyle = 'vertical-align: text-bottom; margin-left: 8px;';
        var icons = this.icons;
        var thingIDs = Object.keys(things);
        $.getJSON(this.api.gettipped, {
            tipped: thingIDs.toString()
        }, function(response) {
            response.forEach(function (tipped) {
                var id = tipped.fullname.replace(/^t._/, '');
                var thing = things[id];
                var tagline = thing.find('.tagline').first();
                var plural = tipped.tipQTY > 1;
                var title = this.quantityString(tipped) + ' to ' +
                        thing.find('.author:first').text() + ' for this ';
                if (plural) {
                    title = 'redditors have given ' + title;
                } else {
                    title = 'a redditor has given ' + title;
                }
                if (thing.closest('.link').length === 0) {
                    title += 'comment.';
                } else {
                    title += 'submission.';
                }
                var icon = $('<img/>').attr({
                    src: icons.tipped,
                    style: iconStyle,
                    title: title
                });
                tagline.append(icon);
                if (plural) {
                    tagline.append($('<span/>').text('x' + tipped.tipQTY));
                }
            }.bind(this));
        }.bind(this));
    },

    injectBotStatus: function injectBotStatus() {
        $.getJSON(this.api.gettips, function(response) {
            var lastEvaluated = new Date(response.last_evaluated * 1000);
            var botStatus = null;
            if (Date.now() - lastEvaluated > this.botDownThreshold) {
                botStatus = '<span class="status-down">DOWN</span>';
            } else {
                botStatus = '<span class="status-up">UP</span>';
            }
            $('a[href="http://bitcointip.net/status.php"]').html(botStatus);
        });
    },

    save: function save() {
        var json = JSON.stringify(this.options);
        RESStorage.setItem('RESoptions.bitcoinTip', json);
    },

    load: function load() {
        var json = RESStorage.getItem('RESoptions.bitcoinTip');
        if (json) {
            this.options = JSON.parse(json);
        }
    },

    /** The main entry point. */
    go: function go() {
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

        /** Find the thing for this element. */
        $.fn.thing = function() {
            return this.closest('.thing');
        };

        if (this.options.status.value === 'basic') {
            this.icons.pending = this.icons.completed;
            this.icons.reversed = this.icons.completed;
        }

        if (this.options.attachButtons.value) {
            this.attachTipButtons();
        }

        if (this.options.subreddit.value) {
            this.attachSubredditIndicator();
        }

        if (this.options.hide.value) {
            this.hideVerifications();
        }

        if (this.options.balance.value) {
            this.attachBalance();
        }

        if (this.options.status.value !== 'none') {
            var tips = this.getTips(this.tipregex);
            var fun = this.getTips(this.tipregexFun);
            var all = $.extend({}, tips, fun);
            this.attachTipStatuses(all);
            if (Object.keys(all).length > 0) {
                this.attachReceiverStatus(this.getTips(/(?:)/));
            }
        }

        if (RESUtils.currentSubreddit() === 'bitcointip') {
            this.injectBotStatus();
        }
    }
};








/* Preferences */
(function() {
    if (location.pathname !== '/r/bitcointip/wiki/preferences') return;
    $('div.md.wiki').wrap($('<form/>').attr({
        'class': 'tip-preferences roundfield'
    }));

    function makeText(name, value) {
        return $('<input/>').attr({
            name: name,
            type: 'text',
            value: value,
            'class': 'tip-preference'
        });
    }

    function makeSelect(name, options, def) {
        if (def == null) {
            def = preferences[name];
            if (typeof def === 'boolean') {
                def = options[def ? 0 : 1].toLowerCase();
            }
        }
        var $input = $('<select/>').attr({
            name: name,
            'class': 'tip-preference'
        });
        for (var i = 0; i < options.length; i++) {
            var v = options[i];
            var $option = $('<option/>').attr({
                value: v.toLowerCase()
            }).text(v);
            if (def === v.toLowerCase()) {
                $option.attr('selected', true);
            }
            $input.append($option);
        }
        return $input;
    }

    function fix(name, input) {
        var $li = $('a[href="/pref-' + name + '"]').parent();
        var label = $li.text();
        $li.empty().append($('<label/>').text(label).addClass('roundfield'))
            .append(input);
    }

    /* Build up the form. */
    fix('basetip', makeText('basetip', preferences.baseTip));
    fix('hide', makeSelect('hide', ['Yes', 'No']));
    fix('status', makeSelect('status', ['Detailed', 'Basic', 'None']));
    fix('currency', makeSelect('currency', ['USD', 'BTC']));
    fix('balance', makeSelect('balance', ['Yes', 'No']));
    fix('subreddit', makeSelect('subreddit', ['Yes', 'No']));

    var $submitA = $('a[href="/pref-submit"]');
    $submitA.replaceWith($('<input/>').attr({
        type: 'submit',
        value: $submitA.text() || 'Save Preferences'
    }));

    var $form = $('form.tip-preferences');
    function v(name) {
        return $form.find('.tip-preference[name="' + name + '"]').val();
    }

    $('form.tip-preferences').submit(function(event) {
        event.preventDefault();
        preferences.baseTip = v('basetip');
        preferences.hide = v('hide') === 'yes';
        preferences.status = v('status');
        preferences.currency = v('currency');
        preferences.balance = v('balance') === 'yes';
        preferences.subreddit = v('subreddit') === 'yes';
        savePreferences();
        window.location.reload(true); // Just to provide feedback
    });
}());
