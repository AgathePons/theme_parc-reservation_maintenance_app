const { Event } = require("../models");

const eventController = {
    openedEvents: async (_, response) => {
        try {
            response.json(await Event.findOpenedEvents());
        } catch(error) {
            console.log(error);
            response.status(500).json(error.message);
        }
    }
};

module.exports = eventController;