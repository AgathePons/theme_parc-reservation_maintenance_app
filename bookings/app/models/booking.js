const CoreModel = require('./codeModel');

/**
 * An entity representing an incoming booking
 * @typedef Booking
 * @property {number} id
 * @property {number} visitor_id
 * @property {number} event_id
 * @property {number} places
 * @property {Date} scheduled_time
 */
class Booking extends CoreModel {

    static async findByVisitorId(visitorId) {
        return (await CoreModel.getArray('SELECT * FROM booking WHERE visitor_id=$1 AND scheduled_time > now()', 
            [visitorId])).map(row => new Booking(row)); 
    }

    static async create(json) {
        return new Booking(await CoreModel.getRow('SELECT * FROM new_booking($1)', [json]));
    }
}

module.exports = Booking;