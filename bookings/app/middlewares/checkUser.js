const {Visitor} = require('../models');
const {MissingVisitorArgument, VisitorNotFound, OutdatedTicket, MaxBookingReached} = require('../errors');

const checkUser = (checkBooking=false) => async (request, response, next) => {
    if (!request.params.ticketNumber && !request.params.visitorId) {
        return response.status(400).json(new MissingVisitorArgument().message);
    }
    let visitor;
    try {
        if (request.params.ticketNumber) {
            visitor = await Visitor.findByTicketNumber(request.params.ticketNumber);
            if (!visitor.id) {
                return response.status(404).json(new VisitorNotFound(request.params.ticketNumber).message);
            }
            if (!visitor.valid_ticket) {
                return response.status(401).json(new OutdatedTicket(visitor.ticket_number).message);
            }
        }
        if (request.params.visitorId) {
            visitor = await Visitor.findById(request.params.visitorId);
            if (!visitor.valid_ticket) {
                return response.status(401).json(new OutdatedTicket(visitor.ticket_number).message);
            }
            if (checkBooking && !visitor.can_book) {
                return response.status(401).json({
                    bookingStatus: false, 
                    error: new MaxBookingReached(visitor.ticket_number).message
                });
            }
        }
        response.locals.visitor = visitor;
        next();
    } catch (error) {
        console.log(error);
        response.status(500).json(error.message);
    }
}

module.exports = checkUser;