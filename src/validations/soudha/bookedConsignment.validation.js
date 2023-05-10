const Joi = require('joi');
const { objectId } = require('../custom.validation');
const { bookedConsignmentStatus } = require('../../config/constant');

const addConsignment = {
  body: Joi.object().keys({
    bookingDate: Joi.date().required(),
    oilType: Joi.string().required(),
    bookedQuantity: Joi.number().required(),
    rate: Joi.number().required(),
    advancePayment: Joi.number(),
    gst: Joi.number().required(),

    partnerId: Joi.string().custom(objectId),
    status: Joi.string()
      .required()
      .valid(...Object.values(bookedConsignmentStatus)),
  }),
};

const getConsignment = {
  params: Joi.object().keys({
    consignmentId: Joi.string().custom(objectId),
  }),
};
const getConsignmentOfPartner = {
  params: Joi.object().keys({
    partnerId: Joi.string().custom(objectId),
  }),
};
const deleteConsignmentOfPartner = {
  params: Joi.object().keys({
    partnerId: Joi.string().custom(objectId),
  }),
};

const updateConsignment = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),

    bookingDate: Joi.date().required(),
    oilType: Joi.string().required(),
    bookedQuantity: Joi.number().required(),
    rate: Joi.number().required(),
    gst: Joi.number().required(),
    advancePayment: Joi.number(),
    status: Joi.string()
      .required()
      .valid(...Object.values(bookedConsignmentStatus)),
  }),
};

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
  deleteConsignmentOfPartner,
  updateConsignment,
  getConsignment,
};
