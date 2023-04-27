const express = require('express');
const validate = require('../../../middlewares/validate');
const auth = require('../../../middlewares/auth');
const { receivedConsignmentValidation } = require('../../../validations');
const { receivedConsignmentController } = require('../../../controllers');

const router = express.Router();

router.post(
  '/consignmentReceived',
  auth(),
  validate(receivedConsignmentValidation.addReceivedConsignment),
  receivedConsignmentController.addReceivedConsignment
);

router
  .route('/consignmentReceived/:receivedConsignmentId')
  .delete(
    auth(),
    validate(receivedConsignmentValidation.deleteReceivedConsignment),
    receivedConsignmentController.deleteReceivedConsignment
  )
  .patch(
    auth(),
    validate(receivedConsignmentValidation.updateReceivedConsignment),
    receivedConsignmentController.updateReceivedConsignment
  );

router.get(
  '/consignmentReceived/:bookedConsignmentId',
  auth(),
  validate(receivedConsignmentValidation.getReceivedConsignmentByBooked),
  receivedConsignmentController.getReceivedConsignmentByBooked
);

module.exports = router;
