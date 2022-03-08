const Incident = require('../models/incident');

const incidentController = {
    incidents: async (_, response) => {
        try {
            const incidents = await Incident.findAll();
            response.render('index', {page: 'incidents', incidents});
        } catch(error) {
            console.log(error);
            response.status(500).render('error', {page: 'incidents', error: error.message});
        }
    },

    incident: async (request, response) => {
        try {
            const incident = await Incident.findOne(request.params.incidentId);
            response.render('incident', {page: 'incidents', incident});
        } catch(error) {
            console.log(error);
            response.status(500).render('error', {page: 'incidents', error: error.message});
        }
    },

    updateIncident: async (request, response) => {
        try {
            await Incident.update({...request.body, ...request.params});
            response.redirect('/v1/');
        } catch(error) {
            console.log(error);
            response.status(500).render('error', {page: 'incidents', error: error.message});
        }
    },

    addIncidentForm: async (_, response) => {
        const events = await Incident.eventsList();
        response.render('addIncident', {page: 'addIncident', events});
    },

    addIncident: async (request, response) => {
        try {
            const id = await Incident.create(request.body);
            response.redirect(`/v1/incident/${id}`);
        } catch(error) {
            console.log(error);
            response.status(500).render('error', {page: 'addIncident', error: error.message});
        }
    },

    modifyEventForm: async (_, response) => {
        const events = await Incident.eventsList();
        response.render('modifyEvent', {page: 'events', events});
    },

    modifyEvent: async (request, response) => {
        await Incident.modifyEvent(request.body);
        const events = await Incident.eventsList();
        response.render('modifyEvent', {page: 'events', events});
    }


}

module.exports = incidentController;