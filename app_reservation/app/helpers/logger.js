/**
 * Bunyan n'est pas le plus populaire des package,
 * mais il a l'avantage d'être complet et simple à implémenter
 * Donc le parfait candidat pour une démonstration !
 *
 * Liste des niveaux de log
 *
 * "fatal" (60):
 *     The service/app is going to stop or
 *     become unusable now. An operator should definitely look into this soon.
 *     "error" (50): Fatal for a particular request,
 *     but the service/app continues servicing other requests.
 *     An operator should look at this soon(ish).
 * "warn" (40):
 *     A note on something that should probably
 *     be looked at by an operator eventually.
 * "info" (30):
 *     Detail on regular operation.
 * "debug" (20):
 *     Anything else, i.e. too verbose to be included in "info" level.
 * "trace" (10):
 *     Logging from external libraries used by
 *     your app or very detailed application logging.
 */
 const bunyan = require('bunyan');

 const streams = [];
 
 // On n'affiche pas les erreurs dans le terminal en production ou en test
 // nb : ce fragment de code ne peut pas être tester par Jest.
 if (!process.env.NODE_ENV !== 'production') {
     streams.push({
         level: 'error',
         // créer un affichage dans le terminal
         stream: process.stdout,
     });
 } else {
     streams.push({
         level: 'error', // On ne conserve que les logs a partir du niveau error
         path: './log/error.log', // Le chemin du fichier de log (on pense à l'ignorer dans git)
         type: 'rotating-file', // on précise que l'on va faire une rotation de fichiers (Nouveau fichier dans une période défini + historique de fichiers conservés)
         period: '1d', // rotation des fichiers de log journalière
         count: 3, // On garde un historique de 3 fichiers de log (Donc ici 3 jours)
     });
 }
 
 const logger = bunyan.createLogger({
     name: 'base-rest-api',
     streams,
 });
 
 module.exports = logger;
 