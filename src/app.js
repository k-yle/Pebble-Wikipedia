//version 2.2
var API_BASE_URL = 'http://kyle1.azurewebsites.net/pebble/wikipedia/v1/',
    token = 'xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx-xxxx',



    aplite = (Pebble.getActiveWatchInfo() ? (Pebble.getActiveWatchInfo().platform || 'aplite') : 'aplite') == 'aplite',
    ajax = require('ajax'),
    settings = require('settings'),
    UI = {
        Vector2: require('vector2'),
        Card: require('ui/card'),
        Menu: require('ui/menu'),
        Vibe: require('ui/vibe'),
        Voice: require('ui/voice'),
        Window: require('ui/window'),
        Text: require('ui/text')
    },
    q = new UI.Card({
        title: 'Loading…',
        style: settings.option("LargeFontSize") ? 'large' : 'small',
        titleColor: 'blue',
        backgroundColor: 'black',
    }),
    URL,
    LOCAL = new UI.Menu({
        sections: [{
            items: [{}]
        }]
    });
function DictationError(e) {
    return {
        'noMicrophone': 'Dictation failed becasue there is no microphone.',
        'systemAborted': 'Dictation was aborted.',
        'transcriptionRejected': 'The transcription was rejected.',
        'transcriptionRejectedWithError': 'The transcription was rejected with an error.',
        'connectivityError': 'There was an error with the connection to the phone.',
        'noSpeechDetected': 'No speech detected.',
        'disabled': 'Dictation is disabled.',
        'internalError': 'There was an internal error.',
        'recognizerError': 'There was a recognizer error.',
        'sessionAlreadyInProgress': 'There is already a dictation session in progress.',
    }[e.err] || 'There was an unknown error.';
}
function Show($input, $m, $itemIndex, $subtitle) {
    console.log(URL = API_BASE_URL + (settings.option('CC') || 'en') + '/get/' + encodeURIComponent($input) + '/' + token);
    ajax({
        url: URL,
        type: 'json'
    }, function (data) {
        console.log(JSON.stringify(data, null, 4));
        new UI.Card({
            subtitle: data.title || "Error",
            body: data.body,
            scrollable: true,
            style: settings.option("LargeFontSize") ? 'large' : 'small',
            titleColor: 'white',
            subtitleColor: aplite ? 'white' : 'pictonBlue',
            backgroundColor: 'black',
            bodyColor: 'white',
        }).show();
        q.hide();
        if (typeof $itemIndex == 'number')
            LOCAL.item(0, $itemIndex, {
                subtitle: $subtitle || 'undefined'
            });
    }, function (e) {
        die('\n There are no Wikipedia articles about \'' + $input + '\'', ' No Results');
    });
}
function die(msg, subtitle) {
    console.log('[error] ' + msg);
    new UI.Card({
        subtitle: subtitle || ' Error!',
        subicon: 'images/warn.png',
        body: '\n' + (msg || 'No Internet'),
        scrollable: true,
        style: settings.option("LargeFontSize") ? 'large' : 'small',
        subtitleColor: aplite ? 'white' : 'pictonBlue',
        backgroundColor: 'black',
        bodyColor: 'white',
    }).show();
}
(function () {
    for (var i = 0, arr = [['cq', true], ['CC', 'en'], ['units', true], ['LargeFontSize', false]]; i < 4; i++)
        if (settings.option(arr[i][0]) == void (null))
            settings.option(arr[i][0], arr[i][1]);
}());
settings.config({
    url: API_BASE_URL + 'config.html'
});
var wind = new UI.Window({
    backgroundColor: 'black',
    fullscreen: true,
    action: {
        up: 'images/menu.png',
        select: 'images/dice.png',
        down: 'images/pin.png',
        backgroundColor: aplite ? 'white' : 'blue'
    }
}).add(new UI.Text({
    color: 'white',
    position: new UI.Vector2(5, 0),
    size: new UI.Vector2(124, 60),
    textAlign: 'left',
    text: 'Wikipedia'
})).show();
wind.on('click', 'up', function () {
    UI.Vibe.vibrate('short');
    UI.Voice.dictate('start', settings.option("cq"), function (v) {
        if (v.err) {
            if (v.err != 'systemAborted')
                die(DictationError(v), ' Dictation Error');
            return;
        } else {
            q.show();
            Show(z(v.transcription));
        }
    });
});
wind.on('click', 'select', function () {
    UI.Vibe.vibrate('short');
    q.show();
    console.log(URL = API_BASE_URL + (settings.option('CC') || 'en') + '/random/' + token);
    ajax({
        url: URL,
        type: 'json'
    }, function (data) {
        new UI.Card({
            title: 'Random Article',
            subtitle: data.title || "Error",
            body: data.body,
            scrollable: true,
            style: settings.option("LargeFontSize") ? 'large' : 'small',
            titleColor: 'white',
            subtitleColor: aplite ? 'white' : 'pictonBlue',
            backgroundColor: 'black',
            bodyColor: 'white',
        }).show();
        q.hide();
    }, function (error) {
        die(error, 'AJAX Error');
        q.hide();
    });
});
wind.on('click', 'down', function () {
    UI.Vibe.vibrate('short');
    q.show();
    navigator.geolocation.getCurrentPosition(function (pos) {
        console.log(JSON.stringify(pos, null, 4));
        console.log(URL = API_BASE_URL + (settings.option('CC') || 'en') + '/geosearch/' + pos.coords.latitude + '/' + pos.coords.longitude + '/' + token);
        ajax({
            url: URL,
            type: 'json'
        }, function (json) {
            console.log(JSON.stringify(json, null, 4));
            LOCAL = new UI.Menu({
                backgroundColor: 'black',
                textColor: 'white',
                highlightBackgroundColor: 'blue',
                highlightTextColor: 'white',
                sections: (function () {
                    var sections = [{
                        title: 'Nearby Places',
                        items: []
                    }];
                    var metric = settings.option('units');
                    for (var u, i = 0; i < json.length; ++i) {
                        if (metric)
                            u = Math.ceil(json[i].dist.toFixed(1)) + ' km';
                        else
                            u = ((json[i].dist / 8) * 5).toFixed(2) + ' miles';
                        sections[0].items.push({
                            title: json[i].title,
                            subtitle: u,
                            pageid: json[i].pageid,
                            location: u
                        });
                    }
                    return sections;
                }())
            }).show();
            LOCAL.on('select', function (ea) {
                Show(ea.item.title, null, ea.itemIndex, ea.item.subtitle);
                LOCAL.item(0, ea.itemIndex, {
                    subtitle: 'Loading…'
                });
            });
            q.hide();
        }, function (error) {
            die(error, 'AJAX error');
            q.hide();
        });
    }, function (err) {
        die(err.message, ' Location Error');
        q.hide();
    }, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 7000
    });
});
function z(r) {
    var o = [],
        C = 0,
        e = 0,
        t = 0,
        d = 0,
        a = 0,
        h = 0;
    for (r += ''; C < r.length;)
        t = r.charCodeAt(C),
          191 >= t ? (
            o[e++] = String.fromCharCode(t),
            C++
        ) : 223 >= t ? (
            d = r.charCodeAt(C + 1),
            o[e++] = String.fromCharCode((31 & t) << 6 | 63 & d),
            C += 2
        ) : 239 >= t ? (
            d = r.charCodeAt(C + 1),
            a = r.charCodeAt(C + 2),
            o[e++] = String.fromCharCode((15 & t) << 12 | (63 & d) << 6 | 63 & a),
            C += 3
        ) : (
            d = r.charCodeAt(C + 1),
            a = r.charCodeAt(C + 2),
            h = r.charCodeAt(C + 3),
         t = (7 & t) << 18 | (63 & d) << 12 | (63 & a) << 6 | 63 & h,
            t -= 65536,
             o[e++] = String.fromCharCode(55296 | t >> 10 & 1023),
             o[e++] = String.fromCharCode(56320 | 1023 & t),
             C += 4
        );
    return o.join('');
}
