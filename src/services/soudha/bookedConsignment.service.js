const httpStatus = require('http-status');
const { SoudhaPartner } = require('../../models');
const { BookedConsignment } = require('../../models');
const ApiError = require('../../utils/ApiError');
const pick = require('../../utils/pick');
const receivedConsignmentService = require('./receivedConsignment.service');
const { bookedConsignmentStatus } = require('../../config/constant');
const soudhaPartnerService = require('./soudhaPartner.service');

const createConsignment = async req => {
  const partnerBody = {
    ...req.body,
    createdBy: req.user._id,
  };
  const bookedConsignment = await BookedConsignment.create(partnerBody);

  await SoudhaPartner.findByIdAndUpdate(partnerBody.partnerId, {
    $push: { consignments: bookedConsignment.id },
  });

  if (await getBookingStatus(bookedConsignment.partnerId)) {
    await changePartnerStatusCompleted(bookedConsignment.partnerId);
  } else {
    await changePartnerStatusPending(bookedConsignment.partnerId);
  }

  return bookedConsignment;
};

const getConsignmentOfPartner = async req => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = [
    {
      path: 'createdBy',
      select: 'name',
    },
  ];

  const filters = pick(req.query, ['oilType', 'status']);

  if (filters.oilType) {
    filters.oilType = { $regex: filters.oilType, $options: 'i' };
  }

  const filter = {
    partnerId: req.params.partnerId,
    ...filters,
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
  const updateConsignment = await bookedConsignment.updateOne(req.body);
  if (await getBookingStatus(bookedConsignment.partnerId)) {
    await changePartnerStatusCompleted(bookedConsignment.partnerId);
  } else {
    await changePartnerStatusPending(bookedConsignment.partnerId);
  }

  return updateConsignment;
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

  const pendingConsignment = await BookedConsignment.paginate(filter, options);
  return pendingConsignment;
};

const getConsignmentTotalInfo = async (partnerId, isPending) => {
  let totalInfo;

  if (isPending) {
    totalInfo = await BookedConsignment.aggregate([
      {
        $match: {
          $expr: { $eq: ['$partnerId', { $toObjectId: partnerId }] },
          status: 'pending',
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
  } else {
    totalInfo = await BookedConsignment.aggregate([
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
  }

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

const getBookingStatus = async partnerId => {
  const partnersConsignments = await BookedConsignment.find({ partnerId });

  // const isAllCompleted = await Promise.all(
  //   partnersConsignments.every(function (element) {
  //     return element.status === bookedConsignmentStatus.COMPLETED;
  //   })
  // );

  const isAllCompleted = await partnersConsignments.every(function (element) {
    return element.status === bookedConsignmentStatus.COMPLETED;
  });

  return isAllCompleted;
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
const changePartnerStatusPending = async id => {
  const partner = SoudhaPartner.findById(id);

  if (!partner) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Partner not found');
  }
  return partner.updateOne({
    soudhaStatus: bookedConsignmentStatus.PENDING,
  });
};
module.exports = {
  createConsignment,
  getConsignmentOfPartner,
  deleteConsignmentOfPartner,
  updateConsignmentOfPartner,
  getConsignmentTotalInfo,
  getConsignment,
  getPendingConsignment,
  getBookingStatus,
};
