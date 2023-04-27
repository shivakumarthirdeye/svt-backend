const httpStatus = require('http-status');
const { SoudhaPartner, ReceivedConsignment } = require('../../models');
const { BookedConsignment } = require('../../models');
const ApiError = require('../../utils/ApiError');
const pick = require('../../utils/pick');

const createReceivedConsignment = async receivedItem => {
  const receivedConsignment = await ReceivedConsignment.create(receivedItem);
  console.log(
    '🚀 ~ file: receivedConsignment.service.js:9 ~ createReceivedConsignment ~ receivedConsignment:',
    receivedConsignment
  );

  await BookedConsignment.findByIdAndUpdate(receivedItem.bookedConsignmentId, {
    $push: { receivedConsignments: receivedConsignment._id },
  });

  return receivedConsignment;
};

const getReceivedConsignmentsByBooked = async req => {
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const filter = {
    bookedConsignmentId: req.params.bookedConsignmentId,
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

  return await receivedConsignment.deleteOne();
};
const updateReceivedConsignment = async req => {
  const id = req.params.receivedConsignmentId;
  const body = req.body;

  const receivedConsignment = await ReceivedConsignment.findById(id);

  if (!receivedConsignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Consignment not found');
  }

  return receivedConsignment.updateOne(body);

  // await BookedConsignment.updateOne(
  //   { _id: receivedConsignment.bookedConsignmentId },
  //   { $pull: { receivedConsignments: receivedConsignment._id } }
  // );

  // return await receivedConsignment.deleteOne();
};

const getReceivedConsignmentTotalInfo = async bookedConsignmentId => {
  const totalInfo = await ReceivedConsignment.aggregate([
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
        totalPendingConsignment: { $sum: '$billingQuantity' },
        differenceAmount: { $sum: '$difference' },
        pendingPayment: { $sum: '$payment' },
      },
    },
  ]);

  return totalInfo;
};

module.exports = {
  createReceivedConsignment,
  getReceivedConsignmentsByBooked,
  deleteReceivedConsignment,
  getReceivedConsignmentTotalInfo,
  updateReceivedConsignment,
};
