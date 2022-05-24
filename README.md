# Theme parc - Management app two in one

This project is about a fictional Theme Parc.  
It is made up of two applications:

- **Maintenance web app**: a maintenance web app that allows to open, edit, and close incidents on attractions
- **Reservation API**: An API to handle reservation for attractions slots, according to incidents/closed attraction, and remaining tickets available

------------------------

## Maintenance web app

## Reservation API app

## Conception

**MCD**

```sql
réserve, 0N ATTRACTION, 0N VISITEUR: nombre de places, horaire de réservation
ATTRACTION: nom public, capacité, heure d'ouverture, heure de fermeture, durée
impacte, 11 INCIDENT, 0N ATTRACTION : date et heure de constat

VISITEUR: numéro de billet, date de début de validité, date de fin de validité
:
INCIDENT: numéro d'incident, nature, technicien assigné, date de résolution

```

![MCD](./conception/oparc.svg)

### Réservation d'attractions

Dariusz rêve de grandeur. Mais il a surtout de vicieux concurrents à secouer tels des cocotiers pour attirer leurs visiteurs chez O'parc ! Et pour ça, il compte bien commencer par faire le "minimum syndical", ce que tout parc qui se respecte propose aujourd'hui : une application mobile. Rassurez-vous, rien de fou sur cette appli : si on peut voir les attractions ouvertes et réserver des places pour celles-ci, ce sera amplement suffisant ! Et pour limiter les abus, un visiteur ne pourra pas réserver plus de 3 attractions distinctes en même temps (une réservation se "libère" quand l'horaire réservé est dépassé). Pour faciliter la réservation par les familles et éviter de trop scinder les groupes, un visiteur pourra spécifier un nombre d'accompagnants pour chaque réservation (3 accompagnants max).

### Maintenance des attractions

Les attractions mécanisées, ça s'use. Les spectacles n'ont pas lieu s'il pleut trop. Il faut que les agents de maintenance et les coordinateurs de spectacles puissent intervenir directement sur les heures d'ouverture et de fermeture de n'importe quelle attraction pour en limiter le temps d'ouverture ou les fermer complètement. Et il faudra, bien entendu, que les visiteurs qui avaient réservé lesdites attractions soient prévenus de l'annulation de leur réservation. En temps réel, il y tient.



## Deux projets, un seul repo, il y a un problème, non ?

Non :slightly_smiling_face: On va faire ce qu'on appelle, dans le jargon git, un _monorepo_. Quand plusieurs applications dépendent d'une même base ou dépendent l'une de l'autre, la répartition _une appli = un repo_ devient vite pénible et on peut facilement mettre à jour un repo mais pas l'autre, quelqu'un qui ne connaît pas bien le projet pourrait déployer une appli mais pas l'autre etc. Bref, le _monorepo_, c'est un choix structurel qui impose parfois quelques contraintes mais rien d'insurmontable et qui assure qu'un code un peu _tentaculaire_ est maintenu à un seul et unique endroit.

Bon, je vous le présente comme une nouveauté mais en fait, ce qu'on fait depuis le début de la spé API & Data, c'est du monorepo :boom: Eh oui, un dossier `app` avec une appli Node et un dossier `migrations` avec un projet Sqitch dont dépend l'appli Node, c'est bien **deux** projets hébergés sous un même toit.


Ici, on va regrouper dans ce repo :
- Un projet Sqitch évidemment, qu'est-ce qu'on ferait sans une base de données ?
- Un premier projet Node : l'API qui sera consommée par l'application mobile.
- Un deuxième projet Node : l'application web pour la maintenance des attractions.

Le versioning de BDD devrait cohabiter sans souci avec le code applicatif. Par contre, les deux applications vont impliquer quelques ajustements :
- Parce qu'elles peuvent être déployées à des endroits différents, elles devraient chacune avoir leur `package.json` et leur dossier `node_modules`.
- Pour la production, on pourra les lancer avec chacune leur rôle de connexion passé directement dans la ligne de commande : `PGUSER=oparc_maintenance PGPASSWORD=<un_motdepasse_ultra_sécurisé> PGDATABASE=<ladresse_de_la_db> node maintenance/server.js` par exemple. Mais pour le développement, un `.env`, c'est beaucoup plus rapide. Sauf qu'ici, 2 apps = 2 _.env_ :thinking: La doc explique comment désigner le fichier à charger avec `dotenv` :relieved:

## L'organisation

Faîtes comme vous voulez :wink: un Trello pourrait probablement vous faciliter la vie. N'hésitez pas à vous répartir les tâches (1 étudiant rédige une migration, 1 autre code l'API, 1 troisième coordonne + rotation fréquente).

Si vous préférez travailler avec une base de données commune (ce qui évite à tout le monde dans le groupe de s'assurer qu'il/elle a bien déployé toutes les migrations), rappelez-vous qu'Heroku propose un service de bases de données Postgres avec un plan gratuit (très limité mais largement suffisant pour ce projet). Ajoutez une target `heroku` au projet Sqitch, l'info sera retranscrite dans le fichier `sqitch.conf` du projet : un `commit` et un `push`, et la prochaine fois que les collègues _pulleront_, ils récupéreront la target et pourront eux aussi appliquer une migration avec un simple `sqitch deploy heroku` :heart_eyes:

Dernière précision, ça peut paraître évident mais choisissez bien 2 ports différents pour les 2 applications :sweat_smile:

## Les tâches

### a) Mettre en place la base

N'hésitez pas à multiplier les migrations pour avancer progressivement et surtout pour répartir le travail. Il faut mettre en place les tables évidemment, mais elles nécessitent peut-être la création de domaines. Et pour pouvoir accéder à des informations _calculées_, ça peut être pas mal de créer des vues qui vous faciliteront le travail par la suite. Par exemple, une vue qui affiche pour chaque attraction le prochain créneau (=le début du prochain spectacle ou la prochaine heure à laquelle une attraction mécanisée démarrera).

Et puisqu'un atelier, c'est l'occasion de découvrir des choses, assurez-vous que la base de données respecte _la troisième forme normale_.

### b) Réservation d'attraction et de spectacles

L'API est simple mais vous allez écrire la requête SQL la plus brutale que vous n'ayez jamais connue :bomb:

**Endpoints**

méthode | chemin | description | retour
-------- | ------ | ---------- | -------
GET | /init | nécessaire pour préconfigurer l'application, cette route reçoit le numéro de billet saisi par le visiteur (dans la query string ou en param, comme vous voulez) | Objet _visitor_ (JSON)
GET | /events | liste des attractions **actives**, chaque événement doit avoir une propriété nommée _open_, un booléen qui indique si l'attraction est ouverte ou fermée au moment de la requête | Tableau d'objets _event_ (JSON)
GET | /bookings | liste les réservations futures du visiteur | Tableau d'objets _booking_ (JSON)
PUT | /book | demande une réservation en fournissant l'id du billet, l'id de l'attraction et le nombre de places :cactus: | Objet _booking_ ou false (JSON)

**Note importante** : Toutes les routes vont avoir besoin de connaître l'identité du visiteur. C'est la raison même de l'existence de la route `/init` qui reçoit le numéro de billet et retourne toutes les autres infos liées au visiteur, notamment son _id_, qu'il faudra fournir aux autres routes (dans la query string, par exemple)

Rappels pour cette API :
- Les attractions actives sont les attractions sur lesquelles il n'y a pas d'opérations de maintenance en cours (= pas d'incident non-résolu), peut-être qu'une vue vous faciliterait la tâche ?
- Les réservations sont limitées à 3 par visiteur. Pour en effectuer une autre, le visiteur devra attendre que la plus ancienne de ses réservations soit expirée (=antérieure à _maintenant_). Pensez à intégrer cette contrainte dans la fonction qui réserve une attraction.
- :cactus::cactus::cactus: La réservation doit tenir compte de la capacité de l'attraction. Une réservation n'est donc pas systématiquement le prochain créneau disponible de l'attraction mais plutôt le prochain créneau pour lequel il reste suffisamment de places pour honorer la demande (**ne tenez pas compte de ce point dans un premier temps, vous consacrerez une migration spécifique à cette amélioration**)

### c) Maintenance des attractions

Une appli "classique" avec un front HTML et sans AJAX (navigation par liens uniquement). L'interface HTML peut être ultra minimaliste, utilisez un framework CSS et PUG (_plus d'infos_ :arrow_down:) pour éviter de perdre du temps ici.

**Endpoints**

méthode | chemin | type | description | retour
-------- | ------ | ----- | ---------- | -------
GET | _racine_ | page | listing des incidents en cours | HTML
GET | /incident/{id} | page | détails d'un incident + formulaire pour changer son avancement, assigner un technicien ou fermer l'incident | HTML
POST | /incident/{id} | page | cible du formulaire de modification d'incident, répercute les changements et redirige sur la page incident | redirection HTTP
GET | /incident/new | page | formulaire d'ouverture d'incident | HTML
POST | /incident/new | page | cible du formulaire de création d'incident, crée l'incident puis redirige sur la page de cet incident | redirection HTTP

**Note importante** : [PUG](https://pugjs.org/api/getting-started.html) est un moteur de rendu HTML qui permet d'accélérer énormément l'écriture de HTML mais il est assez tâtillon, n'hésitez pas à vous entraîner dans un projet à part. Ah et comme les templates sont _compilés_ au démarrage de l'application qui les utilise, si vous modifiez un template, il faut penser à redémarrer le serveur pour voir la modif. Et comme ni _node-dev_ ni _nodemon_ ne surveille les fichiers de templates car ce ne sont pas des fichiers JS, le redémarrage ne se fera pas automatiquement en sauvegardant le fichier. Par contre, chaque fois que vous faîtes `ctrl+S` dans un fichier JS, même si vous n'avez rien modifié, ces deux outils détectent la sauvegarde et relancent votre serveur :sunglasses:
