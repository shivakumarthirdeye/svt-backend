const express = require('express');
const validate = require('../../../middlewares/validate');
const { soudhaPartnerValidation } = require('../../../validations');
const { soudhaPartnerController } = require('../../../controllers');
const auth = require('../../../middlewares/auth');

const router = express.Router();

router
  .route('/partner')
  .patch(
    // auth(),
    validate(soudhaPartnerValidation.updatePartner),
    soudhaPartnerController.updateSoudhaPartner
  )
  .post(
    // auth(),
    validate(soudhaPartnerValidation.addPartner),
    soudhaPartnerController.addSoudhaPartner
  );

router.get(
  '/partners',
  // auth(),
  validate(soudhaPartnerValidation.getPartners),
  soudhaPartnerController.getAllPartners
);

router
  .route('/partner/:partnerId')
  .delete(
    // auth(),
    validate(soudhaPartnerValidation.deletePartner),
    soudhaPartnerController.deletePartner
  )
  .get(
    // auth(),
    validate(soudhaPartnerValidation.getPartner),
    soudhaPartnerController.getPartner
  );

module.exports = router;
