class MissingVisitorArgument extends Error {
    constructor() {
        super('Missing ticket number or visitor id');
    }
}


class VisitorNotFound extends Error {
    constructor(ticketNumber) {
        super(`Ticket with number ${ticketNumber} not found`);
    }
}

class OutdatedTicket extends Error {
    constructor(ticketNumber) {
        super(`Ticket with number ${ticketNumber} is outdated`);
    }
}

class MaxBookingReached extends Error {
    constructor(ticketNumber) {
        super(`Ticket with number ${ticketNumber} has already 3 incoming bookings registered`);
    }
}

class UnavailableEvent extends Error {
    constructor(id) {
        super(`Event with id '${id}' is currently unavailable`);
    }
}

class NoMatchingTime extends Error {
    constructor(name, ticketNumber) {
        super(`Next occurence of event '${name}' is out of ticket with number ${ticketNumber} validity`);
    }
}

module.exports = {
    MissingVisitorArgument,
    VisitorNotFound,
    OutdatedTicket,
    MaxBookingReached,
    UnavailableEvent,
    NoMatchingTime
};
