const httpStatus = require('http-status');
const { SoudhaPartner } = require('../../models');
const { BookedConsignment } = require('../../models');
const ApiError = require('../../utils/ApiError');
const pick = require('../../utils/pick');
const receivedConsignmentService = require('./receivedConsignment.service');
const { bookedConsignmentStatus } = require('../../config/constant');
const soudhaPartnerService = require('./soudhaPartner.service');
const moment = require('moment');
const {
  changePartnerStatusCompleted,
  changePartnerStatusPending,
} = require('../util.service');

const createConsignment = async req => {
  const partnerBody = {
    ...req.body,
    pendingConsignment: req.body.bookedQuantity,
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

  const filters = pick(req.query, [
    'oilType',
    'status',
    'startDate',
    'endDate',
  ]);

  if (filters?.oilType) {
    filters.oilType = { $regex: filters.oilType, $options: 'i' };
  }
  if (filters?.startDate && filters?.endDate) {
    filters.bookingDate = {
      $gte: new Date(new Date(filters?.startDate).setHours(00, 00, 00)),
      $lte: new Date(new Date(filters?.endDate).setHours(23, 59, 59)),
    };
  }

  // filters.bookingDate = {
  //   $gte: new Date(new Date('2023-05-01').setHours(00, 00, 00)),
  //   $lte: new Date(new Date('2023-05-03').setHours(00, 00, 00)),
  // };

  const filter = {
    partnerId: req.params.partnerId,
    ...filters,
  };

  delete filter.startDate;
  delete filter.endDate;

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

  const data = await bookedConsignment.deleteOne();

  if (await getBookingStatus(bookedConsignment.partnerId)) {
    await changePartnerStatusCompleted(bookedConsignment.partnerId);
  } else {
    await changePartnerStatusPending(bookedConsignment.partnerId);
  }

  return data;
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
          totalPendingConsignment: { $sum: '$pendingConsignment' },
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
          totalPendingConsignment: { $sum: '$pendingConsignment' },
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

module.exports = {
  createConsignment,
  getConsignmentOfPartner,
  deleteConsignmentOfPartner,
  updateConsignmentOfPartner,
  getConsignmentTotalInfo,
  getConsignment,
  getPendingConsignment,
  getBookingStatus,
  // getBookingStatus,
};
