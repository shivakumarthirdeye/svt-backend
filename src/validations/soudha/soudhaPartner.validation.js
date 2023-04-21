const Joi = require('joi');
const { soudhaPartnerStatus } = require('../../config/constant');
const { objectId } = require('../custom.validation');

const addPartner = {
  body: Joi.object().keys({
    partnerName: Joi.string().required(),
    location: Joi.string().required(),
    whatsappNo: Joi.string().required(),
    status: Joi.string()
      .required()
      .valid(...Object.values(soudhaPartnerStatus)),
  }),
};
const updatePartner = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
    status: Joi.string()
      .required()
      .valid(...Object.values(soudhaPartnerStatus)),
  }),
};

const getPartner = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};
const deletePartner = {
  params: Joi.object().keys({
    partnerId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  addPartner,
  getPartner,
  deletePartner,
  updatePartner,
};
