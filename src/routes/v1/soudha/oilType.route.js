const express = require('express');
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const { oilTypeController } = require('../../../controllers');

const router = express.Router();

router
  .route('/oilType')
  .get(auth(), oilTypeController.getOilTypes)
  .post(auth(), oilTypeController.addOilType);

module.exports = router;
