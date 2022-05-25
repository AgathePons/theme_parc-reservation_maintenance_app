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

  async insertReservation(req, res) {
    try {
      const ticket = req.params.ticket;
      const visitor = await visitorDataMapper.findByTicket(ticket);
      if (!visitor) {
        throw new ApiError('This ticket does not exists', { statusCode: 404 });
      }
      const savedReservation = await visitorDataMapper.insert(req.body);
      return res.json(savedReservation);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = visitor;
