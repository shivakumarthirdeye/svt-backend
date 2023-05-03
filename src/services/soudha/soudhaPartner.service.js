const httpStatus = require('http-status');
const SoudhaPartner = require('../../models/soudha/soudhaPartner.modal');

const ApiError = require('../../utils/ApiError');
const pick = require('../../utils/pick');
const bookedConsignmentService = require('./bookedConsignment.service');
const { bookedConsignmentStatus } = require('../../config/constant');

const createPartner = async req => {
  const partnerBody = {
    ...req.body,
    createdBy: req.user._id,
  };

  const partnerData = {
    ...partnerBody,
    tableId: `${partnerBody.partnerName.split(' ')[0].toLowerCase()}-${
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
  const options = pick(req.query, ['sortBy', 'limit', 'page', 'q']);
  options.populate = [
    {
      path: 'createdBy',
      select: 'name',
    },
  ];

  const filter = pick(req.query, ['partnerName']);

  if (filter.partnerName) {
    filter.partnerName = { $regex: filter.partnerName, $options: 'i' };
  }

  return SoudhaPartner.paginate(filter, options);
};
const getPartner = async partnerId => {
  const partner = SoudhaPartner.findById(partnerId);
  if (!partner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Partner not found');
  }
  return partner;
};

const deletePartner = async id => {
  const deletePartner = await SoudhaPartner.findById(id);

  if (!deletePartner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Partner not found');
  }

  if (deletePartner.consignments.length > 0) {
    await Promise.all(
      deletePartner.consignments.map(async element => {
        await bookedConsignmentService.deleteConsignmentOfPartner(element);
      })
    );
  }
  await deletePartner.deleteOne();
  return deletePartner;
};

const changePartnerStatusCompleted = async id => {
  const partner = SoudhaPartner.findById(id);

  if (!partner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Partner not found');
  }
  return partner.updateOne({
    soudhaStatus: bookedConsignmentStatus.COMPLETED,
  });
};

module.exports = {
  createPartner,
  getPartners,
  deletePartner,
  updatePartner,
  getPartner,
  changePartnerStatusCompleted,
};
