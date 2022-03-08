const { Booking } = require("../models");
const { NoMatchingTime } = require('../errors');

const bookingController = {
    futureBookings: async (_, response) => {
        try {
            response.json(await Booking.findByVisitorId(response.locals.visitor.id));
        } catch(error) {
            console.log(error);
            response.status(500).json(error.message);
        }
    },

    book: async (request, response) => {
        try {
            const {validity_start, validity_end} = response.locals.visitor;
            const json = {
                ...request.params,
                validity_start,
                validity_end
            }
            response.json({
                bookingStatus: true,
                data: await Booking.create(json)
            });
        } catch(error) {
            console.log(error);
            if (error.column === 'scheduled_time') {
                return response.status(403).json({
                    bookingStatus: false, 
                    error: new NoMatchingTime(response.locals.event, response.locals.visitor.ticket_number).message
                });
            }
            response.status(500).json({
                bookingStatus: false, 
                error: error.message
            });
        }
    }
};

module.exports = bookingController;