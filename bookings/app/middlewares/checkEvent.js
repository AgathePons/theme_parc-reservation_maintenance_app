const { UnavailableEvent } = require('../errors');
const {Event} = require('../models');

const checkEvent = async (request, response, next) => {
    try {
        const event = await Event.findOpenedEvent(request.params.eventId);
        if (!event.id) {
            return response.status(403).json({
                bookingStatus: false, 
                error: new UnavailableEvent(request.params.eventId).message
            });
        }
        response.locals.event = event.public_name;
        next();
    } catch (error) {
        console.log(error);
        response.status(500).json(error.message);
    }
}

module.exports = checkEvent;