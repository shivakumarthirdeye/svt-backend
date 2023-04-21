const httpStatus = require('http-status');
const SoudhaPartner = require('../../models/soudha/soudhaPartner.modal');
const ApiError = require('../../utils/ApiError');
const pick = require('../../utils/pick');

const createPartner = async partnerBody => {
  const partnerData = {
    ...partnerBody,
    partnerId: `${partnerBody.partnerName.split(' ')[0].toLowerCase()}-${
      (await SoudhaPartner.countDocuments({})) + 1
    }`,
  };

  return SoudhaPartner.create(partnerData);
};
const updatePartner = async body => {
  const partner = await SoudhaPartner.findById(body.id);

  if (!partner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Partner not found');
  }
  return partner.updateOne(body);
};
const getPartners = async req => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filter = {};

  return SoudhaPartner.paginate(filter, options);
};
const deletePartner = async id => {
  const deletePartner = await SoudhaPartner.findById(id);

  if (!deletePartner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Partner not found');
  }
  await deletePartner.deleteOne();
  return deletePartner;
};

module.exports = {
  createPartner,
  getPartners,
  deletePartner,
  updatePartner,
};
