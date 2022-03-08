const CoreModel = require('./codeModel');

/**
 * An entity representing an opened event
 * @typedef Event
 * @property {number} id
 * @property {string} public_name
 * @property {number} capacity
 * @property {Time} opening_hour
 * @property {Time} duration
 * @property {Time} open_duration
 * @property {Time} closing_hour
 * @property {boolean} open
 */
class Event extends CoreModel {

    static async findOpenedEvents() {
        return (await CoreModel.getArray('SELECT * FROM opened_events')).map(row => new Event(row)); 
    }

    static async findOpenedEvent(eventId) {
        return new Event(await CoreModel.getRow('SELECT * FROM opened_events WHERE id=$1', [eventId])); 
    }
}

module.exports = Event;