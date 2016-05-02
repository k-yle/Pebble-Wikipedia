/*global module*/


/* Usage:
 * var settings = require('settings'),
 *     Translation = require('translations'),
 *     translate = new Translation(settings);
 * translate.item(word[, replaces]);
 */
module.exports = function translation(settings) {
   var lang = settings.option('CC').toUpperCase() == 'EN' ? 0 :
              settings.option('CC').toUpperCase() == 'DE' ? 1 :
              settings.option('CC').toUpperCase() == 'FR' ? 2 :
              settings.option('CC').toUpperCase() == 'ES' ? 3 : 0;
   var words = {
       ERR: [
           'Error',
           'Fehler',
           'Erreur',
           'error'
       ], LOADING: [
           'Loading…',
           'Laden…',
            'chargement…',
           'cargando…'
       ], NEARBY: [
           'Nearby Places',
           'In der Nähe',
           'lieux à proximité',
           'lugares cercanos'
       ], RANDOM: [
           'Random Article',
           'Zufällige Artikel',
           'article aléatoire',
           'artículo aleatorio'
       ], NO_RESULTS: [
           'No Results',
           'Keine Ergebnisse',
           'Aucun résultat',
           'No hay resultados'
       ], NO_RESULTS_BODY: [
           'There are no articles on the `{{lang}}` Wikipedia about `{{text}}`.\n\nTry changing the language in the settings page.',
           'Es gibt keine Artikel auf der `{{lang}}` Wikipedia über `{{text}}`.\n\nVersuchen Sie, die Sprache in den Einstellungen ändern.',
           'Il n\'y a pas d\'articles sur le `{{lang}}` Wikipedia `{{text}}`. Essayez de changer la langue dans la page des paramètres.',
           'No hay artículos en la Wikipedia `{{lang}}` sobre `{{text}}`. Intente cambiar el idioma en la página de configuración.'
       ], DICTATION_ERR: {
           '0': {},
           'noMicrophone': [
               'Dictation failed becasue there is no microphone',
               'Dictation hat nicht funktioniert, weil da kein Mikrofon ist',
               'Dictée a échoué car il n\'y a pas de microphone',
               'Dictado falló porque no hay micrófono'
           ], 'systemAborted': [
               'Dictation was aborted',
               'Dictation wurde abgebrochen',
               'Dictée a été abandonnée',
               'Dictado fue abortado'
           ], 'transcriptionRejected': [
               'The transcription was rejected',
               'Die Transkription wurde nicht akzeptiert',
               'La transcription n\'a pas été acceptée',
               'La transcripción no fue aceptada'
           ], 'connectivityError': [
               'There was an error with the connection to the phone',
               'Es ist ein Fehler bei der Verbindung zum Telefon',
               'Il y a eu une erreur dans la connexion au téléphone',
               'Se ha producido un error en la conexión con el teléfono'
           ], 'noSpeechDetected': [
               'No speech detected',
               'Keine Sprache erfasst',
               'Aucune parole détectée',
               'No se detecta el habla'
           ], 'disabled': [
               'Dictation is disabled',
               'Dictation ist deaktiviert',
               'Dictée est désactivé',
               'Dictado está desactivado'
           ], 'internalError': [
               'There was an internal error',
               'Es ist ein interner Fehler',
               'Il y avait une erreur interne',
               'Se ha producido un error interno'
           ], 'recognizerError': [
               'There was a recognizer error',
               'Es war ein Erkennungsfehler',
               'Il y avait une erreur de reconnaissance',
               'Hubo un error reconocedor'
           ], 'sessionAlreadyInProgress': [
               'There is already a dictation session in progress',
               'Es gibt bereits eine Diktat-Sitzung im Gange',
               'Il existe déjà une session de dictée en cours',
               'Ya existe una sesión de dictado en curso'
           ], 'transcriptionRejectedWithError': [
               'The transcription was rejected with an error',
               'Die Transkription wurde nicht mit einem Fehler akzeptiert',
               'La transcription n\'a pas été acceptée avec une erreur',
               'La transcripción no fue aceptada con un error'
           ]
       }
   };
   this.item = function (word, replacers) {
       return typeof words[word = word.toUpperCase()][0] == 'object' ? words[word][replacers][lang] :
            words[word][lang].replace(/{{....}}/g, function (e) {
                try {
                    return replacers[e.replace('{{', '').replace('}}', '')];
                } catch (err) {
                    throw new Error(err);
                }
            });
   };
};