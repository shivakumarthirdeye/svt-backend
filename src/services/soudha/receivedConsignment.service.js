const httpStatus = require('http-status');
const { SoudhaPartner, ReceivedConsignment } = require('../../models');
const { BookedConsignment } = require('../../models');
const ApiError = require('../../utils/ApiError');
const pick = require('../../utils/pick');
const { bookedConsignmentStatus } = require('../../config/constant');
const {
  changePartnerStatusCompleted,
  changePartnerStatusPending,
  changeBookingStatusPending,
  changeBookingStatusCompleted,
  getBookingStatus,
  getReceivedConsignmentsTotal,
} = require('../util.service');

const createReceivedConsignment = async req => {
  const receivedItem = {
    ...req.body,

    createdBy: req.user._id,
  };

  const bookedConsignment = await BookedConsignment.findById(
    receivedItem.bookedConsignmentId
  );

  const receivedConsignment = await ReceivedConsignment.create(receivedItem);

  await BookedConsignment.findByIdAndUpdate(receivedItem.bookedConsignmentId, {
    $push: { receivedConsignments: receivedConsignment._id },
  });

  await updateSoudhaStatus(receivedConsignment, bookedConsignment);

  return receivedConsignment;
};

const getReceivedConsignmentsByBooked = async req => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  options.populate = [
    {
      path: 'createdBy',
      select: 'name',
    },
  ];

  const filters = pick(req.query, ['billNo']);

  if (filters?.billNo) {
    filters.billNo = { $regex: filters.billNo, $options: 'i' };
  }

  const filter = {
    bookedConsignmentId: req.params.bookedConsignmentId,
    ...filters,
  };
  const received = await ReceivedConsignment.paginate(filter, options);

  if (!received) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Consignment not found');
  }
  return received;
};

const deleteReceivedConsignment = async id => {
  const receivedConsignment = await ReceivedConsignment.findById(id);

  if (!receivedConsignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Consignment not found');
  }

  await BookedConsignment.updateOne(
    { _id: receivedConsignment.bookedConsignmentId },
    { $pull: { receivedConsignments: receivedConsignment._id } }
  );

  const data = await receivedConsignment.deleteOne();

  await updateSoudhaStatus(receivedConsignment);
  return data;
};
const updateReceivedConsignment = async req => {
  const id = req.params.receivedConsignmentId;
  const body = req.body;

  const receivedConsignment = await ReceivedConsignment.findById(id);

  const bookedConsignment = await BookedConsignment.findById(
    receivedConsignment.bookedConsignmentId
  );

  // if (+body?.billingQuantity === +bookedConsignment?.bookedQuantity) {
  //   await changeBookingStatusCompleted(receivedConsignment.bookedConsignmentId);
  // } else {
  //   await changeBookingStatusPending(receivedConsignment.bookedConsignmentId);
  // }

  // if (await getBookingStatus(bookedConsignment.partnerId)) {
  //   await changePartnerStatusCompleted(bookedConsignment.partnerId);
  // } else {
  //   await changePartnerStatusPending(bookedConsignment.partnerId);
  // }

  if (!receivedConsignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Consignment not found');
  }

  const data = await receivedConsignment.updateOne(body);

  await updateSoudhaStatus(receivedConsignment, bookedConsignment);

  return data;
};

const getReceivedConsignmentTotalInfo = async (
  bookedConsignmentId,
  isPending
) => {
  let totalInfo;
  if (isPending) {
    totalInfo = await ReceivedConsignment.aggregate([
      {
        $match: {
          $expr: {
            $eq: ['$bookedConsignmentId', { $toObjectId: bookedConsignmentId }],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmountPayed: { $sum: '$payment' },
          differenceAmount: { $sum: '$difference' },
          // pendingPayment: { $sum: '$payment' },
        },
      },
    ]);
  } else {
    totalInfo = await ReceivedConsignment.aggregate([
      {
        $match: {
          $expr: {
            $eq: ['$bookedConsignmentId', { $toObjectId: bookedConsignmentId }],
          },
        },
      },
      {
        $group: {
          _id: null,
          // totalPendingConsignment: { $sum: '$pendingConsignment' },
          totalAmountPayed: { $sum: '$payment' },
          differenceAmount: { $sum: '$difference' },
          // pendingPayment: { $sum: '$payment' },
        },
      },
    ]);
  }

  return totalInfo;
};

const updateSoudhaStatus = async (
  receivedConsignment,
  bookedConsignmentInfo
) => {
  let bookedConsignment = bookedConsignmentInfo;
  if (!bookedConsignmentInfo) {
    bookedConsignment = await BookedConsignment.findById(
      receivedConsignment.bookedConsignmentId
    );
  }
  let totalQuantityOfAllReceivedConsignments =
    await getReceivedConsignmentsTotal(receivedConsignment);

  await updatePendingConsignments(
    totalQuantityOfAllReceivedConsignments,
    bookedConsignment
  );

  if (
    totalQuantityOfAllReceivedConsignments ===
    +bookedConsignment?.bookedQuantity
  ) {
    await changeBookingStatusCompleted(receivedConsignment.bookedConsignmentId);
  } else {
    await changeBookingStatusPending(receivedConsignment.bookedConsignmentId);
  }

  if (await getBookingStatus(bookedConsignment.partnerId)) {
    await changePartnerStatusCompleted(bookedConsignment.partnerId);
  } else {
    await changePartnerStatusPending(bookedConsignment.partnerId);
  }
};

const updatePendingConsignments = async (
  totalQuantityOfAllReceivedConsignments,
  bookedConsignment
) => {
  const updateBookedConsignment = await BookedConsignment.findByIdAndUpdate(
    bookedConsignment.id,
    {
      pendingConsignment:
        bookedConsignment.bookedQuantity -
        totalQuantityOfAllReceivedConsignments,
    }
  );
};

module.exports = {
  createReceivedConsignment,
  getReceivedConsignmentsByBooked,
  deleteReceivedConsignment,
  getReceivedConsignmentTotalInfo,
  updateReceivedConsignment,
};
