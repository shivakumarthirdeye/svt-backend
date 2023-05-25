const httpStatus = require('http-status');
const {
  SoudhaPartner,
  BookedConsignment,
  ReceivedConsignment,
} = require('../models');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { bookedConsignmentStatus } = require('../config/constant');

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

const changeBookingStatusCompleted = async id => {
  const bookingConsignment = BookedConsignment.findById(id);

  if (!bookingConsignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Bookings found');
  }
  return bookingConsignment.updateOne({
    status: bookedConsignmentStatus.COMPLETED,
  });
};
const changeBookingStatusPending = async id => {
  const bookingConsignment = BookedConsignment.findById(id);

  if (!bookingConsignment) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No Bookings found');
  }
  return bookingConsignment.updateOne({
    status: bookedConsignmentStatus.PENDING,
  });
};

const getBookingStatus = async partnerId => {
  const partnersConsignments = await BookedConsignment.find({ partnerId });

  const isAllCompleted = await partnersConsignments.every(function (element) {
    return element.status === bookedConsignmentStatus.COMPLETED;
  });

  return isAllCompleted;
};
const getReceivedConsignmentsTotal = async receivedConsignment => {
  const bookedConsignment = await BookedConsignment.findById(
    receivedConsignment.bookedConsignmentId
  );

  let totalQuantityOfAllReceivedConsignments = 0;

  const receivedConsignTotalInfo = await Promise.all(
    bookedConsignment.receivedConsignments.map(async element => {
      const receivedConsignment = await ReceivedConsignment.findById(element);

      totalQuantityOfAllReceivedConsignments =
        totalQuantityOfAllReceivedConsignments +
        receivedConsignment.billingQuantity;

      return totalQuantityOfAllReceivedConsignments;
    })
  );

  return totalQuantityOfAllReceivedConsignments;
};

module.exports = {
  changePartnerStatusCompleted,
  changePartnerStatusPending,
  changeBookingStatusCompleted,
  changeBookingStatusPending,
  getBookingStatus,
  getReceivedConsignmentsTotal,
};
