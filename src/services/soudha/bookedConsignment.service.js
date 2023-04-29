const httpStatus = require('http-status');
const { SoudhaPartner } = require('../../models');
const { BookedConsignment } = require('../../models');
const ApiError = require('../../utils/ApiError');
const pick = require('../../utils/pick');
const receivedConsignmentService = require('./receivedConsignment.service');

const createConsignment = async partnerBody => {
  const bookedConsignment = await BookedConsignment.create(partnerBody);

  await SoudhaPartner.findByIdAndUpdate(partnerBody.partnerId, {
    $push: { consignments: bookedConsignment.id },
  });

  return bookedConsignment;
};

const getConsignmentOfPartner = async req => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filter = {
    partnerId: req.params.partnerId,
  };
  const bookedConsignment = await BookedConsignment.paginate(filter, options);

  if (!bookedConsignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Consignment not found');
  }
  return bookedConsignment;
};

const updateConsignmentOfPartner = async req => {
  const bookedConsignment = await BookedConsignment.findById(req.body.id);
  if (!bookedConsignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Consignment not found');
  }
  return await bookedConsignment.updateOne(req.body);
};
const deleteConsignmentOfPartner = async id => {
  const bookedConsignment = await BookedConsignment.findById(id);

  if (!bookedConsignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Consignment not found');
  }

  await SoudhaPartner.updateOne(
    { _id: bookedConsignment.partnerId },
    { $pull: { consignments: bookedConsignment._id } }
  );

  if (bookedConsignment.receivedConsignments.length > 0) {
    await Promise.all(
      bookedConsignment.receivedConsignments.map(async element => {
        await receivedConsignmentService.deleteReceivedConsignment(element);
      })
    );
  }

  return await bookedConsignment.deleteOne();
};

const getPendingConsignment = async req => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = 'partnerId';

  const filter = {
    status: 'pending',
  };
  console.log(
    '🚀 ~ file: bookedConsignment.service.js:63 ~ getPendingConsignment ~ options:',
    options
  );

  const pendingConsignment = await BookedConsignment.paginate(filter, options);
  return pendingConsignment;
};

const getConsignmentTotalInfo = async partnerId => {
  const totalInfo = await BookedConsignment.aggregate([
    {
      $match: {
        $expr: { $eq: ['$partnerId', { $toObjectId: partnerId }] },
      },
    },
    {
      $group: {
        _id: null,
        totalBookQuantity: { $sum: '$bookedQuantity' },
        averageRate: { $sum: '$averageRate' },
      },
    },
  ]);

  return totalInfo;
};

const getConsignment = async consignmentId => {
  const bookedConsignment = await BookedConsignment.findById(
    consignmentId
  ).populate('partnerId');
  if (!bookedConsignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Consignment not found');
  }
  return bookedConsignment;
};

module.exports = {
  createConsignment,
  getConsignmentOfPartner,
  deleteConsignmentOfPartner,
  updateConsignmentOfPartner,
  getConsignmentTotalInfo,
  getConsignment,
  getPendingConsignment,
};
