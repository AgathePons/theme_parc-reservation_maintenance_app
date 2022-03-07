const express = require('express');
const visitorController = require('../../controllers/visitor');

const router = express.Router();

router.get('/:ticket/init', visitorController.getOneVisitor );

router.use(() => {
  throw new ApiError('API Route not found', { statusCode: 404 });
});

module.exports = router;
