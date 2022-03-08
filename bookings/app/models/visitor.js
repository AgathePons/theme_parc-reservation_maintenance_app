const CoreModel = require('./codeModel');

/**
 * An entity representing an identified visitor
 * @typedef Visitor
 * @property {number} id
 * @property {string} ticket_number
 * @property {Date} validity_start
 * @property {Date} validity_end
 * @property {boolean} valid_ticket
 * @property {boolean} can_book
 */

class Visitor extends CoreModel {

    static async findByTicketNumber(ticketNumber) {
        return new Visitor(await CoreModel.getRow('SELECT * FROM identified_visitor WHERE ticket_number=$1', [ticketNumber]));

    }

    static async findById(id) {
        return new Visitor(await CoreModel.getRow('SELECT * FROM identified_visitor WHERE id=$1', [id]));
    }
}

module.exports = Visitor;