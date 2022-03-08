const express = require('express');
const visitorController = require('../../controllers/visitor');
const attractionController = require('../../controllers/attraction');

const router = express.Router();

router.get('/:ticket/init', visitorController.getOneVisitor);
router.get('/events', attractionController.getOpenAttractions);
router.get('/:id/bookings', visitorController.getFuturBookings);

router.use(() => {
  throw new ApiError('API Route not found', { statusCode: 404 });
});

module.exports = router;
