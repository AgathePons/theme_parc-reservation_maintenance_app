const {Router} = require('express');
const {bookingController, eventController, visitorController} = require('./controllers');

const {checkUser, checkEvent} = require('./middlewares');

const router = Router();

/**
 * Respond with a visitor idenfified by its ticket number
 * @route GET /init
 * @param {string} ticketNumber.path.required The ticket number
 * @returns {Visitor} 200 - An identified visitor
 * @returns {string} 400 - Missing ticket number
 * @returns {string} 401 - Outdated ticket number
 * @returns {string} 404 - Unknown ticket number
 * @returns {string} 500 - Server error
*/
router.get('/init/:ticketNumber', checkUser(), visitorController.init);

/**
 * Respond with a list of opened events
 * @route GET /events
 * @param {number} visitorId.path.required The id of the visitor
 * @returns {Array<Event>} 200 - An array of opened events
 * @returns {string} 401 - Outdated ticket number
 * @returns {string} 500 - Server error
*/
router.get('/events/:visitorId(\\d+)', checkUser(), eventController.openedEvents);

/**
 * Respond with a list of incoming bookings
 * @route GET /bookings
 * @param {number} visitorId.path.required The id of the visitor
 * @returns {Array<Booking>} 200 - An array of incoming bookings
 * @returns {string} 401 - Outdated ticket number
 * @returns {string} 500 - Server error
*/
router.get('/bookings/:visitorId(\\d+)', checkUser(), bookingController.futureBookings)

/**
 * Respond with a newly registered booking
 * @route PUT /book
 * @param {number} visitorId.path.required The id of the visitor
 * @param {number} eventId.path.required The id of the event
 * @param {number} nbPlaces.path.required The nb of places
 * @returns {Booking} 200 - A newly registered booking
 * @returns {string} 401 - Outdated ticket number
 * @returns {string} 401 - Max bookings reached
 * @returns {string} 403 - Unavailable event
 * @returns {string} 403 - No matching time
 * @returns {string} 500 - Server error
*/
router.put('/book/:visitorId(\\d+)/:eventId(\\d+)/:nbPlaces(\\d+)', checkUser(true), checkEvent, bookingController.book);

module.exports = router;