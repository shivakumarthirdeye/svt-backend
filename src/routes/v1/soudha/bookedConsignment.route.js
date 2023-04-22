const express = require('express');
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const { bookedConsignmentController } = require('../../../controllers');
const { bookedConsignmentValidation } = require('../../../validations');

const router = express.Router();

router
  .route('/consignment')
  .post(
    auth(),
    validate(bookedConsignmentValidation.addConsignment),
    bookedConsignmentController.addBookedConsignment
  );
router
  .route('/consignment/:partnerId')
  .get(
    auth(),
    validate(bookedConsignmentValidation.getConsignmentOfPartner),
    bookedConsignmentController.getConsignmentsByPartner
  );

module.exports = router;
