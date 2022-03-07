const attractionDataMapper = require('../models/attraction');
const { ApiError } = require('../helpers/errorHandler');

const attraction = {
  async getOpenAttractions(_, res) {
    
    const attractions = await attractionDataMapper.findAllOpenAttractions();

    if (!attractions) {
      throw new ApiError('No attractions open', { statusCode: 404 });
    }

    return res.json(attractions);
  },
};

module.exports = attraction;