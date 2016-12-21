/*global escape*/
var settings = require('settings'),
     Feature = require('platform/feature'),
     Vector2 = require('vector2'),
      Window = require('ui/window'),
      simply = require('ui/simply'),
        Card = require('ui/card'),
        Menu = require('ui/menu'),
        Text = require('ui/text'),
        ajax = require('ajax'),
    
    //platform = Pebble.getActiveWatchInfo() ? (Pebble.getActiveWatchInfo().platform || 'aplite') : 'aplite',
    
    NearbyMenu,
    splashScreen = new Card({
        title: 'Loading...',
        style: settings.option("LargeFontSize") ? 'large' : 'small',
        titleColor: Feature.color('blue', 'white'),
        backgroundColor: 'black',
    }),
    status = Feature.color({
        color: 'white',
        backgroundColor: Feature.round('blue', 'pictonBlue'),
        separator: Feature.round('none', 'dotted')
    }, true);


settings.config({
    url: 'https://k-yle.github.io/Pebble-Wikipedia'
}, function (e) {
    var saved = new Card({
        title: 'Saved!',
        titleColor: Feature.color('pictonBlue', 'white'),
        backgroundColor: 'black',
        status: status
    }).show();
    setTimeout(function () {
        saved.hide();
    }, 2000);
});
(function (defaultSettings) {
    for (var item in defaultSettings) 
        if (settings.option(item) === undefined)
            settings.option(item, defaultSettings[item]);
}({
    CC: 'en',
    cq: true,
    vibe: true,
    units: true,
    LargeFontSize: false
}));
function trim(t, r) {
    var n = t.length > r,
        s = n ? t.substr(0, r - 1) : t;
    return s = n ? s.substr(0, s.lastIndexOf(" ")) : s, n ? s + "..." : s;
}
function NoResults(input, error) {
    var lang = (settings.option('CC') || 'en').toUpperCase().replace('EN', 'English');
    die('There are no articles on the ' + lang + ' Wikipedia about ' + input +
        '. \n\n Try changing the language in the settings page.', 'No Results');
    console.warn('>>>> [fail] ' + error);
}
function Show(x, y, z) {
    splashScreen.show();
    ajax({
        url: 'http://' + settings.option('CC') + '.wikipedia.org/w/api.php?' + decodeURIComponent(ajax.formify({
            action: 'query',
            prop: 'extracts',
            format: 'json',
            redirects: true,
            titles: x
        })).replace(/(\%20| )/g, '+'),
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
                subtitleColor: Feature.color('pictonBlue', 'white' ),
                backgroundColor: 'black',
                bodyColor: 'white',
                status: status
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
        title: subtitle || 'Error',
        icon: 'images/warn.png',
        body: '\n' + (msg || 'No Internet'),
        scrollable: true,
        style: settings.option("LargeFontSize") ? 'large' : 'small',
        titleColor: Feature.color('pictonBlue', 'white'),
        backgroundColor: 'black',
        bodyColor: 'white',
        status: status
    }).show();
    splashScreen.hide();
}
var main = new Window({
    backgroundColor: 'black',
    status: status,
    action: {
        up: Feature.microphone('images/menu.png', null),
        select: 'images/dice.png',
        down: 'images/pin.png',
        backgroundColor: Feature.color('blue', 'white')
    }
}).add(new Text({
    text: 'Wikipedia',
    position: new Vector2(Feature.round(20, 10), Feature.round(10, 10)),
    size: new Vector2(90, 36),
    textOverflow: 'ellipsis',
    textAlign: 'left',
    color: 'white',
    font: 'gothic-18-bold'
})).show();

main.on('click', 'up', function () {
    if (!Feature.microphone())
        return console.info('no mic');
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
        url: 'http://' + settings.option('CC') + '.wikipedia.org/w/api.php?' + ajax.formify({
            action: 'query',
            format: 'json',
            rnnamespace: 0,
            list: 'random'
        }),
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
            url: 'http://' + settings.option('CC') + '.wikipedia.org/w/api.php?' + ajax.formify({
                action: 'query',
                format: 'json',
                list: 'geosearch',
                gsradius: 10000,
                formatversion: 2,
                gslimit: 10,
                gscoord: [pos.coords.latitude, pos.coords.longitude].join('|')
            }),
            type: 'json'
        }, function (data) {
            NearbyMenu = new Menu({
                backgroundColor: 'black',
                textColor: 'white',
                highlightBackgroundColor: 'blue',
                highlightTextColor: 'white',
                status: status,
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