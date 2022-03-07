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
};

module.exports = visitor;
