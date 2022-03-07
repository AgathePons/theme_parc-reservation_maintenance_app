const express = require('express');

const router = express.Router();
const controllerHandler = require('./helpers/controllerHandler');

const incidentsController = require('./controllers/incidentsController');

router.get('/', controllerHandler(incidentsController.getAllIncidents));
router.get('/incident/new', controllerHandler(incidentsController.getOpenIncident));
router.get('/incident/:id', controllerHandler(incidentsController.getIncidentById));

router.post('/incident/new', controllerHandler(incidentsController.PostNewIncident));

module.exports = router;
