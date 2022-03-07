const express = require('express');

const router = express.Router();

router.use(() => {
  throw new ApiError('API Route not found', { statusCode: 404 });
});

module.exports = router;
