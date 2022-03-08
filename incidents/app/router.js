const {Router} = require('express');

const {validateBody} = require('./services/validator');
const incident = require('./schemas/incident');

const incidentController = require('./controllers/incidentController');

const router = Router();

router.get('/', incidentController.incidents);

router.get('/incident/:incidentId(\\d+)', incidentController.incident);

router.post('/incident/:incidentId(\\d+)', incidentController.updateIncident);

router.get('/incident/new', incidentController.addIncidentForm);

const errorCallback = (response, error) => response.status(400).render('error', {page: 'addIncident', error: error.message});

router.post('/incident/new', validateBody(incident, errorCallback), incidentController.addIncident);

router.get('/incident/event', incidentController.modifyEventForm);

router.post('/incident/event', incidentController.modifyEvent);



module.exports = router;