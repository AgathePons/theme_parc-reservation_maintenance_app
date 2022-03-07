const express = require('express');

const router = express.Router();
const controllerHandler = require('./helpers/controllerHandler');

const incidentsController = require('./controllers/incidentsController');

router.get('/', controllerHandler(incidentsController.getAllIncidents));

module.exports = router;
