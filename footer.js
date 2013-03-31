var bitcoinTip = modules['bitcoinTip'];
bitcoinTip.beforeLoad();
bitcoinTip.load();
if (!bitcoinTip.getAddress()) {
    bitcoinTip.fetchAddress();
}
bitcoinTip.go();

/* Create the options panel. */
if (location.pathname === '/r/bitcointip/wiki/preferences') {
    var $wiki = $('div.md.wiki');
    var $form = $('<form/>').attr({
        'class': 'tip-preferences roundfield'
    });

    /* Build up the form. */
    for (var item in bitcoinTip.options) {
        var option = bitcoinTip.options[item];
        var $label = $('<label/>').text(option.name).addClass('roundfield');
        var $input = null;
        if (option.type === 'text') {
            $input = $('<input/>').attr({
                name: item,
                type: 'text',
                value: option.value
            });
        } else if (option.type === 'boolean') {
            $input = $('<select/>').attr({
                name: item
            });
            var yes = $('<option/>').attr({
                value: 'true'
            }).text('yes');
            var no = $('<option/>').attr({
                value: 'false'
            }).text('no');
            if (option.value) {
                yes.attr('selected', true);
            } else {
                no.attr('selected', true);
            }
            $input.append(yes).append(no);
        } else if (option.type === 'enum') {
            $input = $('<select/>').attr({
                name: item
            });
            for (var i = 0; i < option.values.length; i++) {
                var value = option.values[i];
                var $option = $('<option/>').attr({
                    value: value.value
                }).text(value.value);
                if (option.value === value.value) {
                $option.attr('selected', true);
            }
                $input.append($option);
            }
        }
        if ($input) {
            var $div = $('<div/>');
            $div.append($label).append($input);
            $form.append($div);
        }
    }

    $form.append($('<input/>').attr({
        type: 'submit',
        value: 'Save Preferences'
    }));

    $form.submit(function(event) {
        event.preventDefault();
        for (var item in bitcoinTip.options) {
            var option = bitcoinTip.options[item];
            var $input = $('input[name=' + item + '], ' +
                           'select[name=' + item + ']');
            if ($input.length === 1) {
                console.log('Saved ' + item);
                var value = $input.val();
                if (option.type === 'boolean') {
                    value = JSON.parse(value);
                }
                bitcoinTip.options[item].value = value;
            } else {
                console.log('Skipped ' + item);
            }
        }
        bitcoinTip.save();
        //window.location.reload(true); // Just to provide feedback
    });

    $wiki.empty().append($form);
}


/* ## Test Tips
 *
 * Rejected:
 *   http://www.reddit.com/r/bitcointip/comments/132nhq/t/c7c7iue
 * Rejected flip:
 *   http://www.reddit.com/r/Bitcoin/comments/14i9e7/y/c7dc6w9
 * Combination folding:
 *   http://www.reddit.com/r/bitcointip/comments/13iykn/b/c7dj8ia
 * Multiple tips to one receiver:
 *   http://www.reddit.com/r/bitcointip/comments/12lmut/c7ny177
 * Multiple guilded to one receiver (for comparison):
 *   http://www.reddit.com/r/AdviceAnimals/comments/15mk25/c7ntrcc
 * Reversed:
 *   http://www.reddit.com/r/IAmA/comments/18tp7t/c8i8qto
 */
