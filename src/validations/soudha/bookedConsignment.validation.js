const Joi = require('joi');
const { objectId } = require('../custom.validation');

const addConsignment = {
  body: Joi.object().keys({
    bookingDate: Joi.date().required(),
    oilType: Joi.string().required(),
    bookedQuantity: Joi.string().required(),
    rate: Joi.string().required(),
    advancePayment: Joi.string(),
    partnerId: Joi.string().custom(objectId),
  }),
};

const getConsignmentOfPartner = {
  params: Joi.object().keys({
    partnerId: Joi.string().custom(objectId),
  }),
};
// const updatePartner = {
//   body: Joi.object().keys({
//     id: Joi.string().custom(objectId),
//     status: Joi.string()
//       .required()
//       .valid(...Object.values(soudhaPartnerStatus)),
//   }),
// };

// const getPartners = {
//   query: Joi.object().keys({
//     sortBy: Joi.string(),
//     limit: Joi.number().integer(),
//     page: Joi.number().integer(),
//   }),
// };
// const deletePartner = {
//   params: Joi.object().keys({
//     partnerId: Joi.string().custom(objectId),
//   }),
// };
// const getPartner = {
//   params: Joi.object().keys({
//     partnerId: Joi.string().custom(objectId),
//   }),
// };

module.exports = {
  addConsignment,
  getConsignmentOfPartner,
};
