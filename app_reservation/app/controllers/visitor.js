const visitorDataMapper = require('../models/visitor');
const { ApiError } = require('../helpers/errorHandler');

const visitor = {
  async getOneVisitor(req, res) {
    const ticket = req.params.ticket;
    const visitor = await visitorDataMapper.findByTicket(ticket);

    if (!visitor) {
      throw new ApiError('Visitor Not Found', { statusCode: 404 });
    }

    return res.json(visitor);
  },

  async getFuturBookings(req, res) {
    const id = req.params.id;
    const bookings = await visitorDataMapper.findFuturBookings(id);

    if (!bookings) {
      throw new ApiError('No Futur Booking', { statusCode: 404 });
    }

    return res.json(bookings);
  },
};

module.exports = visitor;
