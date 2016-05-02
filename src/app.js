/*global escape*/
var TimeText = require('ui/timetext'),
    settings = require('settings'),
     Vector2 = require('vector2'),
      Window = require('ui/window'),
      simply = require('ui/simply'),
      config = require('./config'),
        Card = require('ui/card'),
        Menu = require('ui/menu'),
        Text = require('ui/text'),
        Clay = require('./clay'),
        ajax = require('ajax'),
    
    platform = Pebble.getActiveWatchInfo() ? (Pebble.getActiveWatchInfo().platform || 'aplite') : 'aplite',
      aplite = platform == 'aplite',
    
    NearbyMenu,
    splashScreen = new Card({
        title: 'Loading...',
        style: settings.option("LargeFontSize") ? 'large' : 'small',
        titleColor: aplite ? 'white' : 'blue',
        backgroundColor: 'black',
    }),
    clay = new Clay(config, null, {
        autoHandleEvents: false
    });
<<<<<<< HEAD

Pebble.addEventListener('showConfiguration', function (e) {
  Pebble.openURL(clay.generateUrl());
});

Pebble.addEventListener('webviewclosed', function (e) {
  if (e && !e.response)
      return console.error(e);
  settings.option(clay.getSettings(e.response));
});

function trim(t, r) {
    var n = t.length > r,
        s = n ? t.substr(0, r - 1) : t;
    return s = n ? s.substr(0, s.lastIndexOf(" ")) : s, n ? s + "..." : s;
}
function NoResults(input, error) {
    die('There are no articles on the ' + (settings.option('CC') || 'en').toUpperCase().replace('EN', 'English') +
            ' Wikipedia about ' + input + '.\n\nTry changing the language in the settings page.', 'No Results');
    console.warn('>>>> [fail] ' + error);
=======
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
>>>>>>> origin/master
}
function Show(x, y, z) {
    splashScreen.show();
    ajax({
        url: 'http://'+settings.option('CC')+'.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&redirects=true&titles='+
             encodeURIComponent(x),
        type: 'json'
    }, function (data) {
        try {
            if (data.query === undefined || !data || !data.query || data.query.pages['-1'])
                return NoResults(x, 'HTTP 204 (No Content)');
            var object = data.query.pages[Object.keys(data.query.pages)[0]];
            
            new Card({
                subtitle: object.title || "Error",
                body: trim(object.extract.replace(/<\/?[^>]+(>|$)/g, ''), 500),
                scrollable: true,
                style: settings.option("LargeFontSize") ? 'large' : 'small',
                titleColor: 'white',
                subtitleColor: aplite ? 'white' : 'pictonBlue',
                backgroundColor: 'black',
                bodyColor: 'white',
            }).show();
            splashScreen.hide();
            if (typeof y != 'undefined')
                NearbyMenu.item(0, y.itemIndex, {
                    subtitle: z || ''
                });
        } catch (e) {
            NoResults(x, e);
        }
    }, function (err) {
        NoResults(x, err);
    });
}
function die(msg, subtitle) {
    console.error('>>>> [error] ' + msg);
    new Card({
        subtitle: subtitle || 'Error',
        subicon: 'images/warn.png',
        body: '\n' + (msg || 'No Internet'),
        scrollable: true,
        style: settings.option("LargeFontSize") ? 'large' : 'small',
        subtitleColor: aplite ? 'white' : 'pictonBlue',
        backgroundColor: 'black',
        bodyColor: 'white',
    }).show();
    splashScreen.hide();
}
var main = new Window({
    backgroundColor: 'black',
    fullscreen: true,
    action: {
        up: aplite ? null : 'images/menu.png',
        select: 'images/dice.png',
        down: 'images/pin.png',
        backgroundColor: aplite ? 'white' : 'blue'
    }
}).add(new Text({
    text: '\nWikipedia',
    position: new Vector2(23, 125),
    size: new Vector2(90, 36),
    textOverflow: 'ellipsis',
    textAlign: 'left',
    color: 'white',
    font: 'gothic-18-bold'
})).add(new TimeText({
    position: new Vector2(3, 0),
    size: new Vector2(90, 15),
    text: "%I:%M %p",
    font: 'gothic-28-bold',
    color: '#00AAFF',
    textAlign: 'left'
})).show();

main.on('click', 'up', function () {
    if (aplite)
        return console.info('aplite clicked up');
    if (settings.option("vibe"))
        simply.impl.vibe('short');
    simply.impl.voiceDictationStart(function (v) {
        if (v.err)
            if (v.err == 'sessionAlreadyInProgress' || v.err == 'systemAborted')
                simply.impl.voiceDictationStop();
            else
                die(v.err, 'Dictation Error');
        else
            Show(escape(v.transcription));
    }, settings.option("cq"));
});
main.on('click', 'select', function () {
    if (settings.option("vibe"))
        simply.impl.vibe('short');
    splashScreen.show();
    ajax({
        url: 'http://' + settings.option('CC') + '.wikipedia.org/w/api.php?action=query&format=json&rnnamespace=0&list=random',
        type: 'json'
    }, function (data) {
        Show(data.query.random[0].title);
    }, function (error) {
        die(error, 'Location Error');
    });
});
main.on('click', 'down', function () {
    if (settings.option("vibe"))
        simply.impl.vibe('short');
    splashScreen.show();
    navigator.geolocation.getCurrentPosition(function (pos) {
        ajax({
            url: 'http://' + settings.option('CC') +
                 '.wikipedia.org/w/api.php?action=query&format=json&list=geosearch&gsradius=10000&formatversion=2&gslimit=10&gscoord=' +
                 encodeURIComponent(pos.coords.latitude + '|' + pos.coords.longitude),
            type: 'json'
        }, function (data) {
            NearbyMenu = new Menu({
                backgroundColor: 'black',
                textColor: 'white',
                highlightBackgroundColor: 'blue',
                highlightTextColor: 'white',
                sections: [{
                    title: 'Nearby Places',
                    items: (function () {
                        var e = [];
                        try {
                            if (data.query.geosearch.length <= 0)
                                return [{
                                    title: 'No Results'
                                }];
                            var dist = function (i) {
                                if (settings.option('units'))
                                    return (data.query.geosearch[i].dist / 1000).toFixed(1) + ' km';
                                else
                                    return ((data.query.geosearch[i].dist / 8000) * 5).toFixed(2) + ' miles';
                            };
                            for (var i = 0; i < data.query.geosearch.length; i++)
                                e[i] = {
                                    title: data.query.geosearch[i].title,
                                    subtitle: dist(i)
                                };
                            return e;
                        } catch (err) {
                            console.warn(err);
                            return [{
                                title: 'No Results',
                                subtitle: 'Internal Error'
                            }];
                        }
                    }())
                }]
            }).show();
            NearbyMenu.on('select', function (z) {
                Show(z.item.title, z, z.item.subtitle);
                NearbyMenu.item(0, z.itemIndex, {
                    subtitle: 'Loading...'
                });
            });
            splashScreen.hide();
        }, function (error) {
            die(error, 'Network Error');
        });
    }, function (err) {
        die(err.message, 'Location Error');
    }, {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 7000
    });
});