const Joi = require('joi');
const { objectId } = require('../custom.validation');

const addReceivedConsignment = {
  body: Joi.object().keys({
    date: Joi.date().required(),
    billNo: Joi.string().required(),
    billingQuantity: Joi.number().required(),
    billingRate: Joi.number().required(),
    totalBillingAmount: Joi.number().required(),
    otherAmount: Joi.number().allow(''),
    vehicleNo: Joi.string().required(),
    unloadQuantity: Joi.number().required(),
    shortQuantity: Joi.number().required(),
    payment: Joi.number().allow(''),
    bookedConsignmentId: Joi.string().custom(objectId),
    difference: Joi.number(),
    pendingConsignment: Joi.number(),
    gst: Joi.number().required(),
  }),
};

const getReceivedConsignmentByBooked = {
  params: Joi.object().keys({
    bookedConsignmentId: Joi.string().custom(objectId),
  }),
};
const getConsignmentOfPartner = {
  params: Joi.object().keys({
    partnerId: Joi.string().custom(objectId),
  }),
};
const deleteReceivedConsignment = {
  params: Joi.object().keys({
    receivedConsignmentId: Joi.string().custom(objectId),
  }),
};
const updateReceivedConsignment = {
  params: Joi.object().keys({
    receivedConsignmentId: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
    date: Joi.date().required(),
    billNo: Joi.string().required(),
    billingQuantity: Joi.number().required(),
    billingRate: Joi.number().required(),
    totalBillingAmount: Joi.number().required(),
    otherAmount: Joi.number().allow(null),
    vehicleNo: Joi.string().required(),
    unloadQuantity: Joi.number().required(),
    shortQuantity: Joi.number().required(),
    payment: Joi.number().allow(''),
    gst: Joi.number().required(),
    bookedConsignmentId: Joi.string().custom(objectId),
    pendingConsignment: Joi.number(),
    difference: Joi.number(),
  }),
};

const updateConsignment = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
    bookingDate: Joi.date().required(),
    oilType: Joi.string().required(),
    bookedQuantity: Joi.number().required(),
    rate: Joi.number().required(),
    advancePayment: Joi.number(),
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
  getReceivedConsignmentByBooked,
  addReceivedConsignment,
  deleteReceivedConsignment,
  updateReceivedConsignment,
};
